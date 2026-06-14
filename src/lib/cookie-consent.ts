export const openCookieSettingsEvent = "milosevac:open-cookie-settings";

export function openCookieSettings() {
  window.dispatchEvent(new Event(openCookieSettingsEvent));
}
