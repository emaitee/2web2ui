const initialState = {
  grants: [],
  grantsLoaded: false,
  grantsLoading: false,
  keys: [],
  keysLoaded: false,
  keysLoading: false,
  error: null
};

export default (state = initialState, { payload, type }) => {
  switch (type) {
    // LIST_API_KEYS
    case 'LIST_API_KEYS_PENDING': {
      return { ...state, keysLoading: true, error: null };
    }

    case 'LIST_API_KEYS_SUCCESS': {
      return { ...state, keysLoading: false, keysLoaded: true, keys: payload };
    }

    case 'LIST_API_KEYS_FAIL': {
      return { ...state, keysLoading: false, keysLoaded: true, error: payload };
    }

    case 'CREATE_API_KEY_SUCCESS':
    case 'DELETE_API_KEY_SUCCESS':
    case 'UPDATE_API_KEY_SUCCESS': {
      return { ...state, keysLoaded: false };
    }

    // LIST_GRANTS
    case 'LIST_GRANTS_PENDING': {
      return { ...state, grantsLoading: true, error: null };
    }

    case 'LIST_GRANTS_SUCCESS': {
      return { ...state, grantsLoading: false, grantsLoaded: true, grants: payload };
    }

    case 'LIST_GRANTS_FAIL': {
      return { ...state, grantsLoading: false, grantsLoaded: true, error: payload };
    }

    default: {
      return state;
    }
  }
};
