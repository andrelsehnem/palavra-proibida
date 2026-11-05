// O SDK do AdMob é nativo e não pode entrar no bundle web: o Metro usa este arquivo no lugar do serviço nativo.
export const adMobInterstitialService = {
  initialize: async (): Promise<void> => undefined,
  preload: (): void => undefined,
  showWithFallback: async (_timeoutMs: number): Promise<boolean> => false,
};
