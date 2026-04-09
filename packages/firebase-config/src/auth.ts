import { type Auth } from 'firebase/auth';
import { getFirebaseApp } from './config';

let auth: Auth;

/**
 * Get the Firebase Auth instance.
 *
 * On React Native, call initializeReactNativeAuth() first to set up
 * AsyncStorage persistence. On web, this uses the default browser persistence.
 */
export function getFirebaseAuth(): Auth {
  if (!auth) {
    // Default to standard web auth — React Native apps should call
    // initializeReactNativeAuth() at startup instead.
    const { getAuth } = require('firebase/auth');
    auth = getAuth(getFirebaseApp());
  }
  return auth;
}

/**
 * Initialize Firebase Auth with AsyncStorage persistence for React Native.
 * Call this once at app startup before using getFirebaseAuth().
 */
export async function initializeReactNativeAuth(): Promise<Auth> {
  if (!auth) {
    const { initializeAuth, getReactNativePersistence } = require('firebase/auth');
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    auth = initializeAuth(getFirebaseApp(), {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }
  return auth;
}
