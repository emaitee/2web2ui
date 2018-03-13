import helpers from 'src/helpers/cookieConsent';

export const giveConsent = () => {
  helpers.setCookie();
  return { type: 'GIVE_COOKIE_CONSENT' };
};

