import { Platform } from 'react-native';

export const DISPLAY_FONT = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia',
});

export const BODY_FONT = Platform.select({
  ios: 'AvenirNext-Regular',
  android: 'sans-serif',
  default: 'system-ui',
});

// Fontes carregadas via expo-font em App.tsx (Google Fonts).
export const BRICOLAGE_700 = 'BricolageGrotesque_700Bold';
export const BRICOLAGE_800 = 'BricolageGrotesque_800ExtraBold';
export const INTER_400 = 'Inter_400Regular';
export const INTER_600 = 'Inter_600SemiBold';
export const INTER_700 = 'Inter_700Bold';
