import {
  ADMOB_INTERSTITIAL_COOLDOWN_MS,
  ADMOB_ANDROID_INTERSTITIAL_PROD_UNIT_ID,
  ADMOB_ENABLED,
} from '../data/adMobConfig';

type GoogleMobileAdsModule = typeof import('react-native-google-mobile-ads');
type InterstitialAdInstance = ReturnType<GoogleMobileAdsModule['InterstitialAd']['createForAdRequest']>;

class AdMobInterstitialService {
  private initialized = false;

  private initializePromise: Promise<void> | null = null;

  private interstitial: InterstitialAdInstance | null = null;

  private adsModule: GoogleMobileAdsModule | null | undefined;

  private isLoaded = false;

  private isLoading = false;

  private loadWaiters: ((loaded: boolean) => void)[] = [];

  private listeners: (() => void)[] = [];

  private lastShownAt = 0;

  private getAdsModule(): GoogleMobileAdsModule | null {
    if (this.adsModule !== undefined) {
      return this.adsModule;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      this.adsModule = require('react-native-google-mobile-ads') as GoogleMobileAdsModule;
      return this.adsModule;
    } catch {
      this.adsModule = null;
      return null;
    }
  }

  private getUnitId(adsModule: GoogleMobileAdsModule): string {
    return __DEV__ ? adsModule.TestIds.INTERSTITIAL : ADMOB_ANDROID_INTERSTITIAL_PROD_UNIT_ID;
  }

  async initialize(): Promise<void> {
    if (!ADMOB_ENABLED || this.initialized) {
      return;
    }

    if (this.initializePromise) {
      await this.initializePromise;
      return;
    }

    this.initializePromise = (async () => {
      const adsModule = this.getAdsModule();
      if (!adsModule) {
        return;
      }

      await adsModule.default().setRequestConfiguration({
        testDeviceIdentifiers: __DEV__ ? ['EMULATOR'] : [],
      });

      await adsModule.default().initialize();
      this.initialized = true;
      this.preload();
    })().finally(() => {
      this.initializePromise = null;
    });

    await this.initializePromise;
  }

  private clearListeners() {
    this.listeners.forEach((unsubscribe) => unsubscribe());
    this.listeners = [];
  }

  private resolveLoadWaiters(loaded: boolean) {
    const pending = [...this.loadWaiters];
    this.loadWaiters = [];
    pending.forEach((resolve) => resolve(loaded));
  }

  private createInterstitial() {
    const adsModule = this.getAdsModule();
    if (!adsModule) {
      this.isLoading = false;
      this.resolveLoadWaiters(false);
      return;
    }

    this.clearListeners();

    const ad = adsModule.InterstitialAd.createForAdRequest(this.getUnitId(adsModule), {
      requestNonPersonalizedAdsOnly: true,
    });

    this.listeners = [
      ad.addAdEventListener(adsModule.AdEventType.LOADED, () => {
        this.isLoaded = true;
        this.isLoading = false;
        this.resolveLoadWaiters(true);
      }),
      ad.addAdEventListener(adsModule.AdEventType.ERROR, () => {
        this.isLoaded = false;
        this.isLoading = false;
        this.resolveLoadWaiters(false);
      }),
    ];

    this.interstitial = ad;
  }

  preload() {
    if (!ADMOB_ENABLED || !this.initialized || this.isLoading || this.isLoaded || !this.getAdsModule()) {
      return;
    }

    this.isLoading = true;
    this.createInterstitial();
    this.interstitial?.load();
  }

  private waitForLoad(timeoutMs: number): Promise<boolean> {
    if (this.isLoaded) {
      return Promise.resolve(true);
    }

    if (!this.initialized) {
      return Promise.resolve(false);
    }

    this.preload();

    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        this.loadWaiters = this.loadWaiters.filter((item) => item !== onLoad);
        resolve(false);
      }, timeoutMs);

      const onLoad = (loaded: boolean) => {
        clearTimeout(timer);
        resolve(loaded);
      };

      this.loadWaiters.push(onLoad);
    });
  }

  async showWithFallback(timeoutMs: number): Promise<boolean> {
    if (!ADMOB_ENABLED) {
      return false;
    }

    if (!this.getAdsModule()) {
      return false;
    }

    const now = Date.now();
    const elapsedSinceLastShown = now - this.lastShownAt;

    if (elapsedSinceLastShown < ADMOB_INTERSTITIAL_COOLDOWN_MS) {
      return false;
    }

    await this.initialize();

    const loaded = await this.waitForLoad(timeoutMs);
    const ad = this.interstitial;

    if (!loaded || !ad) {
      return false;
    }

    this.isLoaded = false;

    return new Promise((resolve) => {
      const adsModule = this.getAdsModule();
      if (!adsModule) {
        resolve(false);
        return;
      }

      let settled = false;

      const finalize = (shown: boolean) => {
        if (settled) {
          return;
        }

        settled = true;
        if (shown) {
          this.lastShownAt = Date.now();
        }
        closedSubscription();
        errorSubscription();
        this.preload();
        resolve(shown);
      };

      const closedSubscription = ad.addAdEventListener(adsModule.AdEventType.CLOSED, () => {
        finalize(true);
      });

      const errorSubscription = ad.addAdEventListener(adsModule.AdEventType.ERROR, () => {
        finalize(false);
      });

      ad.show().catch(() => {
        finalize(false);
      });
    });
  }
}

export const adMobInterstitialService = new AdMobInterstitialService();
