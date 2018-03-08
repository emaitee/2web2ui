import { initConsentState, giveConsent } from '../cookieConsent';

import helpers from 'src/helpers/cookieConsent';

jest.mock('src/helpers/cookieConsent');

describe('Action Creator: cookie consent ', () => {
  describe('initConsentState', () => {
    it('should include cookie state in payload', () => {
      helpers.isCookieSet.mockReturnValue(true);
      expect(initConsentState()).toMatchSnapshot();
      expect(helpers.isCookieSet).toHaveBeenCalledTimes(1);
    });
  });

  describe('giveConsent', () => {
    it('should set the cookie', () => {
      helpers.setCookie.mockReturnValue(true);
      expect(giveConsent()).toMatchSnapshot();
      expect(helpers.setCookie).toHaveBeenCalledTimes(1);
    });
  });
});

