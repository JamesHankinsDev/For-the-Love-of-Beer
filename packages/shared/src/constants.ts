/** Maximum distance in meters for GPS check-in eligibility */
export const GEOFENCE_RADIUS_METERS = 100;

/** Maximum acceptable GPS accuracy in meters */
export const MAX_GPS_ACCURACY_METERS = 150;

/** QR token validity duration in minutes */
export const QR_TOKEN_EXPIRY_MINUTES = 10;

/** Maximum length for stamp notes */
export const MAX_NOTE_LENGTH = 280;

/** Hop rating range */
export const MIN_HOP_RATING = 1;
export const MAX_HOP_RATING = 5;

/** Stamp design shape options */
export const STAMP_SHAPES = ['circle', 'square', 'hexagon', 'shield', 'diamond'] as const;

/** US state codes */
export const US_STATE_CODES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  'DC',
] as const;

/** Open Brewery DB API base URL */
export const OPEN_BREWERY_DB_URL = 'https://api.openbrewerydb.org/v1/breweries';

/** Firestore collection names */
export const COLLECTIONS = {
  BREWERIES: 'breweries',
  USERS: 'users',
  STAMPS: 'stamps',
  TRAILS: 'trails',
} as const;
