import { Platform } from 'react-native';
import Constants from 'expo-constants';

export const ADMOB_ANDROID_APP_ID = 'ca-app-pub-7478664676745892~8203726946';

const FALLBACK_ANDROID_INTERSTITIAL_UNIT_ID = 'ca-app-pub-7478664676745892/7217948330';

export const ADMOB_ANDROID_INTERSTITIAL_PROD_UNIT_ID =
  process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ANDROID ?? FALLBACK_ANDROID_INTERSTITIAL_UNIT_ID;

export const ADMOB_INTERSTITIAL_LOAD_TIMEOUT_MS = 1500;

export const ADMOB_INTERSTITIAL_COOLDOWN_MS = 8 * 60 * 1000;

const IS_EXPO_GO = Constants.appOwnership === 'expo';

export const ADMOB_ENABLED =
  Platform.OS === 'android' && !IS_EXPO_GO && process.env.EXPO_PUBLIC_ADS_ENABLED !== 'false';
