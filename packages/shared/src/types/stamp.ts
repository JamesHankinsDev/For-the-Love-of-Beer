import type { Timestamp } from './common';

export type VerificationMethod = 'gps' | 'qr' | 'manual';

export interface Stamp {
  id: string;
  breweryId: string;
  breweryName: string;
  city: string;
  state: string;
  stampedAt: Timestamp;
  verificationMethod: VerificationMethod;
  hopRating: number | null;
  note: string | null;
  photoUrl: string | null;
}
