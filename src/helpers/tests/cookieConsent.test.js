import cookieMock from 'js-cookie';
import cookieConsent from '../cookieConsent';
import config from 'src/config';

jest.mock('js-cookie');

describe('Helper: cookie consent helper', () => {
  const { name, ageDays, options } = config.cookieConsent.cookie;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should set cookie using config', () => {
    cookieConsent.setCookie();
    expect(cookieMock.set).toHaveBeenCalledWith(name, '', expect.objectContaining({
      domain: options.domain,
      expires: ageDays
    }));
  });

  it('should detect cookie existance', () => {
    cookieMock.get.mockReturnValueOnce('');
    expect(cookieConsent.isCookieSet()).toEqual(true);
    expect(cookieMock.get).toHaveBeenCalledWith(name);
  });

  it('should detect a missing cookie', () => {
    cookieMock.get.mockReturnValueOnce(undefined);
    expect(cookieConsent.isCookieSet()).toEqual(false);
    expect(cookieMock.get).toHaveBeenCalledWith(name);
  });
});
