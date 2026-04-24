/** Opens Silktide's cookie-preferences modal. Safe to call before Silktide
 *  finishes booting — returns silently if the global isn't ready.
 *  Used by the Privacy page button and the universal footer link (the floating
 *  cookie icon is intentionally hidden; see index.css `#stcm-icon`). */
export function openCookiePreferences(): void {
  window.silktideConsentManager?.getInstance?.()?.toggleModal(true);
}
