import { giveConsent } from '../cookieConsent';

import helpers from 'src/helpers/cookieConsent';

jest.mock('src/helpers/cookieConsent');

describe('Action Creator: cookie consent ', () => {
  describe('giveConsent', () => {
    it('should set the cookie', () => {
      helpers.setCookie.mockReturnValue(true);
      expect(giveConsent()).toMatchSnapshot();
      expect(helpers.setCookie).toHaveBeenCalledTimes(1);
    });
  });
});

