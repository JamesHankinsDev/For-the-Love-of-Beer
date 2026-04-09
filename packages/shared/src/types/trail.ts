import type { Timestamp } from './common';
import type { StampDesign } from './brewery';

export interface Trail {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  breweryIds: string[];
  region: string | null;
  completionCount: number;
  stampReward: StampDesign;
  isOfficial: boolean;
  createdAt: Timestamp;
}
