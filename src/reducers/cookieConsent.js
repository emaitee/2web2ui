const initialState = { consentGiven: false };

export default (state = initialState, action) => {
  switch (action.type) {
    case 'INIT_COOKIE_CONSENT':
      return { ...state, consentGiven: action.payload.isCookieSet };

    case 'GIVE_COOKIE_CONSENT':
      return { ...state, consentGiven: true };

    default: {
      return state;
    }
  }
};
