import { getFunctions, httpsCallable, type Functions } from 'firebase/functions';
import { getFirebaseApp } from './config';

let functions: Functions;

export function getFirebaseFunctions(): Functions {
  if (!functions) {
    functions = getFunctions(getFirebaseApp());
  }
  return functions;
}

/** Call the verifyStamp Cloud Function. */
export function callVerifyStamp(data: {
  breweryId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  qrToken?: string;
  hopRating?: number;
  note?: string;
}) {
  return httpsCallable<typeof data, { stampId: string; message: string }>(
    getFirebaseFunctions(),
    'verifyStamp',
  )(data);
}

/** Call the generateQrToken Cloud Function. */
export function callGenerateQrToken(data: { breweryId: string }) {
  return httpsCallable<typeof data, { token: string; expiresAt: number; breweryId: string }>(
    getFirebaseFunctions(),
    'generateQrToken',
  )(data);
}
