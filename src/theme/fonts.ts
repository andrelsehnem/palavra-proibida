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
