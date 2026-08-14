import { useEffect } from 'react';

import { ADMOB_ENABLED } from '../../data/adMobConfig';
import { adMobInterstitialService } from '../../services/adMobInterstitialService';

export function AdMobBootstrap() {
  useEffect(() => {
    if (!ADMOB_ENABLED) {
      return;
    }

    void adMobInterstitialService.initialize().catch(() => undefined);
  }, []);

  return null;
}
