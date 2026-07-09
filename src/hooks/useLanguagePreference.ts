import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

import { Consts, type LanguageCode } from '../data/Consts';

const STORAGE_KEY = 'palavra-proibida:language';

const getInitialLanguage = (): LanguageCode => {
  return Consts.DEFAULT_LANGUAGE;
};

export const useLanguagePreference = () => {
  const [language, setLanguageState] = useState<LanguageCode>(getInitialLanguage);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadSavedLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(STORAGE_KEY);
        if (
          isMounted &&
          savedLanguage &&
          Consts.SUPPORTED_LANGUAGES.some((lang) => lang.code === savedLanguage)
        ) {
          setLanguageState(savedLanguage as LanguageCode);
        }
      } catch {
        // Use default language on storage read errors.
      } finally {
        if (isMounted) {
          setIsHydrated(true);
        }
      }
    };

    loadSavedLanguage();

    return () => {
      isMounted = false;
    };
  }, []);

  const setLanguage = async (newLanguage: LanguageCode) => {
    setLanguageState(newLanguage);

    try {
      await AsyncStorage.setItem(STORAGE_KEY, newLanguage);
    } catch {
      // Ignore persistence failures and keep app usable.
    }
  };

  return {
    language,
    setLanguage,
    isHydrated,
  };
};
