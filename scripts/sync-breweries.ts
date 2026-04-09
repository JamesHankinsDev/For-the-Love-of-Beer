/**
 * Open Brewery DB → Firestore sync script.
 *
 * Usage: pnpm sync-breweries
 *
 * Pulls all US breweries from https://api.openbrewerydb.org/v1/breweries
 * and upserts them into Firestore by obdbId.
 *
 * Requires Firebase Admin credentials via GOOGLE_APPLICATION_CREDENTIALS env var.
 */

import { initializeApp, cert, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const OPEN_BREWERY_DB_URL = 'https://api.openbrewerydb.org/v1/breweries';
const PAGE_SIZE = 200;

// State name → abbreviation lookup
const STATE_CODES: Record<string, string> = {
  Alabama: 'AL', Alaska: 'AK', Arizona: 'AZ', Arkansas: 'AR', California: 'CA',
  Colorado: 'CO', Connecticut: 'CT', Delaware: 'DE', Florida: 'FL', Georgia: 'GA',
  Hawaii: 'HI', Idaho: 'ID', Illinois: 'IL', Indiana: 'IN', Iowa: 'IA',
  Kansas: 'KS', Kentucky: 'KY', Louisiana: 'LA', Maine: 'ME', Maryland: 'MD',
  Massachusetts: 'MA', Michigan: 'MI', Minnesota: 'MN', Mississippi: 'MS', Missouri: 'MO',
  Montana: 'MT', Nebraska: 'NE', Nevada: 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
  'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND',
  Ohio: 'OH', Oklahoma: 'OK', Oregon: 'OR', Pennsylvania: 'PA', 'Rhode Island': 'RI',
  'South Carolina': 'SC', 'South Dakota': 'SD', Tennessee: 'TN', Texas: 'TX', Utah: 'UT',
  Vermont: 'VT', Virginia: 'VA', Washington: 'WA', 'West Virginia': 'WV',
  Wisconsin: 'WI', Wyoming: 'WY', 'District of Columbia': 'DC',
};

interface ObdbBrewery {
  id: string;
  name: string;
  brewery_type: string;
  street: string | null;
  city: string | null;
  state: string | null;
  state_province: string | null;
  postal_code: string | null;
  country: string | null;
  latitude: string | null;
  longitude: string | null;
  phone: string | null;
  website_url: string | null;
}

/**
 * Simple geohash encode (base32).
 * Precision 7 gives ~150m accuracy — sufficient for our geofencing.
 */
function encodeGeohash(lat: number, lon: number, precision = 7): string {
  const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';
  let minLat = -90, maxLat = 90;
  let minLon = -180, maxLon = 180;
  let hash = '';
  let bit = 0;
  let ch = 0;
  let isLon = true;

  while (hash.length < precision) {
    if (isLon) {
      const mid = (minLon + maxLon) / 2;
      if (lon > mid) { ch |= 1 << (4 - bit); minLon = mid; }
      else { maxLon = mid; }
    } else {
      const mid = (minLat + maxLat) / 2;
      if (lat > mid) { ch |= 1 << (4 - bit); minLat = mid; }
      else { maxLat = mid; }
    }
    isLon = !isLon;
    if (bit < 4) { bit++; }
    else { hash += BASE32[ch]; bit = 0; ch = 0; }
  }
  return hash;
}

async function fetchPage(page: number): Promise<ObdbBrewery[]> {
  const url = `${OPEN_BREWERY_DB_URL}?by_country=united_states&per_page=${PAGE_SIZE}&page=${page}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function main() {
  // Initialize Firebase Admin
  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credPath) {
    const cred = await import(credPath);
    initializeApp({ credential: cert(cred as ServiceAccount) });
  } else {
    // Falls back to default credentials (e.g., gcloud auth)
    initializeApp();
  }

  const db = getFirestore();
  let page = 1;
  let totalProcessed = 0;
  let totalCreated = 0;
  let totalUpdated = 0;
  let totalSkipped = 0;

  console.log('Starting Open Brewery DB sync...\n');

  while (true) {
    process.stdout.write(`Fetching page ${page}...`);
    const breweries = await fetchPage(page);

    if (breweries.length === 0) {
      console.log(' no more results.');
      break;
    }

    console.log(` got ${breweries.length} breweries.`);

    // Firestore batches max 500 operations
    const BATCH_LIMIT = 450;
    let batch = db.batch();
    let batchCount = 0;

    for (const brewery of breweries) {
      if (!brewery.latitude || !brewery.longitude) {
        totalSkipped++;
        continue;
      }

      const lat = parseFloat(brewery.latitude);
      const lon = parseFloat(brewery.longitude);
      if (isNaN(lat) || isNaN(lon)) {
        totalSkipped++;
        continue;
      }

      const stateName = brewery.state ?? brewery.state_province ?? '';
      const stateCode = STATE_CODES[stateName] ?? '';

      // Check if brewery already exists
      const existing = await db
        .collection('breweries')
        .where('obdbId', '==', brewery.id)
        .limit(1)
        .get();

      const data = {
        obdbId: brewery.id,
        name: brewery.name,
        breweryType: brewery.brewery_type,
        street: brewery.street ?? '',
        city: brewery.city ?? '',
        state: stateName,
        stateCode,
        postalCode: brewery.postal_code ?? '',
        country: 'United States',
        latitude: lat,
        longitude: lon,
        geohash: encodeGeohash(lat, lon),
        phone: brewery.phone ?? null,
        websiteUrl: brewery.website_url ?? null,
        updatedAt: FieldValue.serverTimestamp(),
      };

      if (existing.empty) {
        const ref = db.collection('breweries').doc();
        batch.set(ref, {
          ...data,
          stampDesign: null,
          claimedBy: null,
          isVerified: false,
          visitCount: 0,
          avgRating: 0,
          createdAt: FieldValue.serverTimestamp(),
        });
        totalCreated++;
      } else {
        batch.update(existing.docs[0].ref, data);
        totalUpdated++;
      }

      batchCount++;
      if (batchCount >= BATCH_LIMIT) {
        await batch.commit();
        batch = db.batch();
        batchCount = 0;
      }
    }

    if (batchCount > 0) {
      await batch.commit();
    }

    totalProcessed += breweries.length;
    page++;

    // Rate limit — be nice to the free API
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log('\n--- Sync Complete ---');
  console.log(`Total processed: ${totalProcessed}`);
  console.log(`Created: ${totalCreated}`);
  console.log(`Updated: ${totalUpdated}`);
  console.log(`Skipped (no coords): ${totalSkipped}`);
}

main().catch((err) => {
  console.error('Sync failed:', err);
  process.exit(1);
});
