import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';

const QR_TOKEN_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Generate a signed, time-limited QR token for a brewery.
 * Only callable by the brewery's claimed owner.
 */
export const generateQrToken = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Must be signed in.');
  }

  const { breweryId } = request.data as { breweryId: string };
  const uid = request.auth.uid;

  // Verify the caller owns this brewery
  const breweryDoc = await admin.firestore().collection('breweries').doc(breweryId).get();
  if (!breweryDoc.exists) {
    throw new HttpsError('not-found', 'Brewery not found.');
  }

  const brewery = breweryDoc.data()!;
  if (brewery.claimedBy !== uid) {
    throw new HttpsError('permission-denied', 'You do not own this brewery.');
  }

  // Generate signed token
  const expiresAt = Date.now() + QR_TOKEN_EXPIRY_MS;
  const payload = `${breweryId}:${expiresAt}`;
  const secret = process.env.QR_SECRET || 'default-dev-secret';
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  const token = `${payload}:${signature}`;

  return {
    token,
    expiresAt,
    breweryId,
  };
});
