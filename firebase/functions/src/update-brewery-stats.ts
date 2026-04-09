import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';

/**
 * Firestore trigger: when a new stamp is created, update the brewery's
 * visitCount and avgRating.
 */
export const updateBreweryStats = onDocumentCreated(
  'users/{userId}/stamps/{stampId}',
  async (event) => {
    const stamp = event.data?.data();
    if (!stamp) return;

    const breweryRef = admin.firestore().collection('breweries').doc(stamp.breweryId);

    await admin.firestore().runTransaction(async (tx) => {
      const breweryDoc = await tx.get(breweryRef);
      if (!breweryDoc.exists) return;

      const brewery = breweryDoc.data()!;
      const newVisitCount = (brewery.visitCount || 0) + 1;

      // Recalculate average rating if this stamp has a rating
      let newAvgRating = brewery.avgRating || 0;
      if (stamp.hopRating) {
        const totalRatingPoints = brewery.avgRating * brewery.visitCount + stamp.hopRating;
        const ratedVisits = brewery.visitCount + 1; // Simplified — counts all visits
        newAvgRating = Math.round((totalRatingPoints / ratedVisits) * 10) / 10;
      }

      tx.update(breweryRef, {
        visitCount: newVisitCount,
        avgRating: newAvgRating,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });
  },
);
