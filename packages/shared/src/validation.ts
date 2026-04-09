import {
  GEOFENCE_RADIUS_METERS,
  MAX_GPS_ACCURACY_METERS,
  MAX_NOTE_LENGTH,
  MIN_HOP_RATING,
  MAX_HOP_RATING,
} from './constants';

/**
 * Calculate Haversine distance between two coordinates in meters.
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000; // Earth's radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Check if a user's GPS position is within check-in range of a brewery.
 */
export function isWithinGeofence(
  userLat: number,
  userLon: number,
  breweryLat: number,
  breweryLon: number,
  accuracy?: number,
): boolean {
  if (accuracy !== undefined && accuracy > MAX_GPS_ACCURACY_METERS) {
    return false;
  }
  const distance = haversineDistance(userLat, userLon, breweryLat, breweryLon);
  return distance <= GEOFENCE_RADIUS_METERS;
}

/**
 * Validate a hop rating value (1-5).
 */
export function isValidHopRating(rating: number): boolean {
  return Number.isInteger(rating) && rating >= MIN_HOP_RATING && rating <= MAX_HOP_RATING;
}

/**
 * Validate a stamp note length.
 */
export function isValidNote(note: string): boolean {
  return note.length <= MAX_NOTE_LENGTH;
}
