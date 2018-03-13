import cookieHelpers from 'src/helpers/cookieConsent';

const initialState = { consentGiven: cookieHelpers.isCookieSet() };

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GIVE_COOKIE_CONSENT':
      return { ...state, consentGiven: true };

    case 'LOGOUT': {
      return { ...state, consentGiven: cookieHelpers.isCookieSet() };
    }

    default: {
      return state;
    }
  }
};
