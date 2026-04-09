import { getFirestore, type Firestore } from 'firebase/firestore';
import { getFirebaseApp } from './config';

let db: Firestore;

export function getFirebaseFirestore(): Firestore {
  if (!db) {
    db = getFirestore(getFirebaseApp());
  }
  return db;
}
