import helpers from 'src/helpers/cookieConsent';

export const initConsentState = () => ({
  type: 'INIT_COOKIE_CONSENT',
  payload: { isCookieSet: helpers.isCookieSet() }
});

export const giveConsent = () => {
  helpers.setCookie();
  return { type: 'GIVE_COOKIE_CONSENT' };
};

