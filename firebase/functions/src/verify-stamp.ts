import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

const GEOFENCE_RADIUS_METERS = 100;
const MAX_GPS_ACCURACY_METERS = 150;

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface VerifyStampRequest {
  breweryId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  qrToken?: string;
  hopRating?: number;
  note?: string;
}

/**
 * Callable function to verify a user's check-in and create a stamp.
 */
export const verifyStamp = onCall<VerifyStampRequest>(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Must be signed in to check in.');
  }

  const { breweryId, latitude, longitude, accuracy, qrToken, hopRating, note } = request.data;
  const uid = request.auth.uid;

  // Fetch brewery
  const breweryDoc = await admin.firestore().collection('breweries').doc(breweryId).get();
  if (!breweryDoc.exists) {
    throw new HttpsError('not-found', 'Brewery not found.');
  }

  const brewery = breweryDoc.data()!;
  let verificationMethod: 'gps' | 'qr' = 'gps';

  if (qrToken) {
    // TODO: Validate QR token signature and expiry
    verificationMethod = 'qr';
  } else {
    // GPS verification
    if (accuracy > MAX_GPS_ACCURACY_METERS) {
      throw new HttpsError('failed-precondition', 'GPS accuracy too low. Please try again outdoors.');
    }

    const distance = haversineDistance(latitude, longitude, brewery.latitude, brewery.longitude);
    if (distance > GEOFENCE_RADIUS_METERS) {
      throw new HttpsError(
        'failed-precondition',
        `You're ${Math.round(distance)}m away. You need to be within ${GEOFENCE_RADIUS_METERS}m to check in.`,
      );
    }
  }

  // Validate optional fields
  if (hopRating !== undefined && (hopRating < 1 || hopRating > 5 || !Number.isInteger(hopRating))) {
    throw new HttpsError('invalid-argument', 'Hop rating must be 1-5.');
  }
  if (note !== undefined && note.length > 280) {
    throw new HttpsError('invalid-argument', 'Note must be 280 characters or fewer.');
  }

  // Create stamp
  const stampRef = admin.firestore()
    .collection('users')
    .doc(uid)
    .collection('stamps')
    .doc();

  await stampRef.set({
    id: stampRef.id,
    breweryId,
    breweryName: brewery.name,
    city: brewery.city,
    state: brewery.state,
    stampedAt: admin.firestore.FieldValue.serverTimestamp(),
    verificationMethod,
    hopRating: hopRating ?? null,
    note: note ?? null,
    photoUrl: null,
  });

  return { stampId: stampRef.id, message: 'You stamped your passport!' };
});
