import { useCallback } from 'react';

import { ADMOB_INTERSTITIAL_LOAD_TIMEOUT_MS } from '../data/adMobConfig';
import { adMobInterstitialService } from '../services/adMobInterstitialService';

type ExitAction = () => void | Promise<void>;

export function useAdInterstitialAction() {
  const runWithInterstitial = useCallback(async (action: ExitAction) => {
    try {
      await adMobInterstitialService.showWithFallback(ADMOB_INTERSTITIAL_LOAD_TIMEOUT_MS);
    } catch {
      // If ad flow fails, keep the user flow going.
    } finally {
      await action();
    }
  }, []);

  return {
    runWithInterstitial,
  };
}
