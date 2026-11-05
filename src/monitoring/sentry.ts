import * as Sentry from '@sentry/react-native';

let isSentryInitialized = false;

export const initSentry = () => {
  if (isSentryInitialized) {
    return;
  }

  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
  if (!dsn) {
    return;
  }

  Sentry.init({
    dsn,
    environment:
      process.env.EXPO_PUBLIC_SENTRY_ENVIRONMENT ?? (__DEV__ ? 'development' : 'production'),
    debug: __DEV__,
  });

  isSentryInitialized = true;
};