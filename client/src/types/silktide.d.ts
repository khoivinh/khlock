interface SilktideConsentManagerInstance {
  toggleModal(show: boolean): void;
}

interface SilktideConsentManagerGlobal {
  init?: (config: unknown) => void;
  update?: (newConfig: unknown) => void;
  getInstance?: () => SilktideConsentManagerInstance | null;
  resetConsent?: () => void;
}

declare global {
  interface Window {
    silktideConsentManager?: SilktideConsentManagerGlobal;
  }
}

export {};
