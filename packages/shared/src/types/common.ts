/**
 * Platform-agnostic Timestamp type.
 * Maps to Firebase Firestore Timestamp at runtime.
 */
export interface Timestamp {
  seconds: number;
  nanoseconds: number;
}
