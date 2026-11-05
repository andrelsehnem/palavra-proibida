import { useEffect } from 'react';
import * as Sentry from '@sentry/react-native';

import { ADMOB_ENABLED } from '../../data/adMobConfig';
import { adMobInterstitialService } from '../../services/adMobInterstitialService';

export function AdMobBootstrap() {
  useEffect(() => {
    if (!ADMOB_ENABLED) {
      return;
    }

    void adMobInterstitialService.initialize().catch((error) => {
      Sentry.captureException(error, {
        tags: {
          area: 'ads-bootstrap',
        },
      });
    });
  }, []);

  return null;
}
