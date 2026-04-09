import type { Timestamp } from './common';

export type BreweryType =
  | 'micro'
  | 'nano'
  | 'regional'
  | 'brewpub'
  | 'large'
  | 'planning'
  | 'bar'
  | 'contract'
  | 'proprietor'
  | 'closed';

export interface StampDesign {
  shape: 'circle' | 'square' | 'hexagon' | 'shield' | 'diamond';
  primaryColor: string;
  accentColor: string;
  tagline: string | null;
}

export interface Brewery {
  id: string;
  obdbId: string | null;
  name: string;
  breweryType: BreweryType;
  street: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
  geohash: string;
  phone: string | null;
  websiteUrl: string | null;
  stampDesign: StampDesign | null;
  claimedBy: string | null;
  isVerified: boolean;
  visitCount: number;
  avgRating: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
