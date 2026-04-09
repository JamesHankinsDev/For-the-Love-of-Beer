import type { Timestamp } from './common';

export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoUrl: string | null;
  homeCity: string | null;
  homeState: string | null;
  stampCount: number;
  statesVisited: string[];
  achievements: string[];
  following: string[];
  followers: string[];
  isBreweryOwner: boolean;
  createdAt: Timestamp;
}
