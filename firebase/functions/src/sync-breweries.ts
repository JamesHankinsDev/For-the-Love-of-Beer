import { onSchedule } from 'firebase-functions/v2/scheduler';
import * as admin from 'firebase-admin';
import * as ngeohash from 'ngeohash';

const OPEN_BREWERY_DB_URL = 'https://api.openbrewerydb.org/v1/breweries';
const PAGE_SIZE = 200;

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
 * Weekly scheduled function to sync breweries from Open Brewery DB into Firestore.
 */
export const syncBreweries = onSchedule('every sunday 03:00', async () => {
  const db = admin.firestore();
  let page = 1;
  let totalSynced = 0;

  while (true) {
    const url = `${OPEN_BREWERY_DB_URL}?by_country=united_states&per_page=${PAGE_SIZE}&page=${page}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Failed to fetch page ${page}: ${response.statusText}`);
      break;
    }

    const breweries: ObdbBrewery[] = await response.json();
    if (breweries.length === 0) break;

    const batch = db.batch();

    for (const brewery of breweries) {
      if (!brewery.latitude || !brewery.longitude) continue;

      const lat = parseFloat(brewery.latitude);
      const lon = parseFloat(brewery.longitude);
      if (isNaN(lat) || isNaN(lon)) continue;

      const query = await db
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
        state: brewery.state ?? brewery.state_province ?? '',
        stateCode: '', // Derived during enrichment
        postalCode: brewery.postal_code ?? '',
        country: 'United States',
        latitude: lat,
        longitude: lon,
        geohash: ngeohash.encode(lat, lon, 7),
        phone: brewery.phone ?? null,
        websiteUrl: brewery.website_url ?? null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      if (query.empty) {
        const ref = db.collection('breweries').doc();
        batch.set(ref, {
          ...data,
          stampDesign: null,
          claimedBy: null,
          isVerified: false,
          visitCount: 0,
          avgRating: 0,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        // Upsert — preserve brewery-owner overrides
        const existing = query.docs[0];
        batch.update(existing.ref, data);
      }
    }

    await batch.commit();
    totalSynced += breweries.length;
    page++;
  }

  console.log(`Brewery sync complete. Processed ${totalSynced} records.`);
});
