import cookie from 'js-cookie';
import config from 'src/config';

const { name, ageDays, options } = config.cookieConsent.cookie;

const isCookieSet = () => cookie.get(name) !== undefined;

const setCookie = () => cookie.set(name, '', { ...options, expires: ageDays });

export default { isCookieSet, setCookie };
