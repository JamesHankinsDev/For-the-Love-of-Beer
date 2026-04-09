import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';

interface AchievementDef {
  id: string;
  name: string;
  check: (stampCount: number, statesVisited: string[]) => boolean;
}

const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first_stamp', name: 'First Sip', check: (count) => count >= 1 },
  { id: 'five_stamps', name: 'Regular', check: (count) => count >= 5 },
  { id: 'ten_stamps', name: 'Enthusiast', check: (count) => count >= 10 },
  { id: 'twentyfive_stamps', name: 'Connoisseur', check: (count) => count >= 25 },
  { id: 'fifty_stamps', name: 'Passport Pro', check: (count) => count >= 50 },
  { id: 'hundred_stamps', name: 'Century Club', check: (count) => count >= 100 },
  { id: 'five_states', name: 'Road Tripper', check: (_, states) => states.length >= 5 },
  { id: 'ten_states', name: 'Cross Country', check: (_, states) => states.length >= 10 },
  { id: 'all_fifty', name: 'Coast to Coast', check: (_, states) => states.length >= 50 },
];

/**
 * Firestore trigger: when a stamp is created, evaluate achievement criteria
 * and update the user's profile.
 */
export const checkAchievements = onDocumentCreated(
  'users/{userId}/stamps/{stampId}',
  async (event) => {
    const stamp = event.data?.data();
    if (!stamp) return;

    const userId = event.params.userId;
    const userRef = admin.firestore().collection('users').doc(userId);

    await admin.firestore().runTransaction(async (tx) => {
      const userDoc = await tx.get(userRef);
      if (!userDoc.exists) return;

      const user = userDoc.data()!;
      const newStampCount = (user.stampCount || 0) + 1;

      // Update states visited
      const statesVisited: string[] = user.statesVisited || [];
      if (stamp.state && !statesVisited.includes(stamp.state)) {
        statesVisited.push(stamp.state);
      }

      // Check for new achievements
      const currentAchievements: string[] = user.achievements || [];
      const newAchievements = ACHIEVEMENTS.filter(
        (a) => !currentAchievements.includes(a.id) && a.check(newStampCount, statesVisited),
      ).map((a) => a.id);

      tx.update(userRef, {
        stampCount: newStampCount,
        statesVisited,
        achievements: [...currentAchievements, ...newAchievements],
      });
    });
  },
);
