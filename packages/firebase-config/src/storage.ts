import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getFirebaseApp } from './config';

let storage: FirebaseStorage;

export function getFirebaseStorage(): FirebaseStorage {
  if (!storage) {
    storage = getStorage(getFirebaseApp());
  }
  return storage;
}
