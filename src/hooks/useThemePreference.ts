import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';
import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';

import type { ThemeMode } from '../domain/types';

const STORAGE_KEY = 'palavra-proibida:theme-mode';

const getInitialMode = (): ThemeMode => {
  const systemScheme = Appearance.getColorScheme();
  return systemScheme === 'dark' ? 'dark' : 'light';
};

export const useThemePreference = () => {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadSavedTheme = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(STORAGE_KEY);
        if (isMounted && (savedMode === 'light' || savedMode === 'dark')) {
          setMode(savedMode);
        }
      } catch (error) {
        Sentry.captureException(error, {
          tags: {
            area: 'theme-preference-load',
          },
        });
        // Use default system mode on storage read errors.
      } finally {
        if (isMounted) {
          setIsHydrated(true);
        }
      }
    };

    loadSavedTheme();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleMode = async () => {
    const nextMode: ThemeMode = mode === 'light' ? 'dark' : 'light';
    setMode(nextMode);

    try {
      await AsyncStorage.setItem(STORAGE_KEY, nextMode);
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          area: 'theme-preference-save',
        },
      });
      // Ignore persistence failures and keep app usable.
    }
  };

  return {
    mode,
    isHydrated,
    toggleMode,
  };
};
