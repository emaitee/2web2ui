const initialState = {
  grants: [],
  keys: [],
  loadingGrants: false,
  loadingKeys: false,
  error: null
};

export default (state = initialState, { payload, type }) => {
  switch (type) {
    // LIST_API_KEYS
    case 'LIST_API_KEYS_PENDING': {
      return { ...state, loadingKeys: true, error: null };
    }

    case 'LIST_API_KEYS_SUCCESS': {
      return { ...state, loadingKeys: false, keys: payload };
    }

    case 'LIST_API_KEYS_FAIL': {
      return { ...state, loadingKeys: false, error: payload };
    }

    // LIST_GRANTS
    case 'LIST_GRANTS_PENDING': {
      return { ...state, loadingGrants: true, error: null };
    }

    case 'LIST_GRANTS_SUCCESS': {
      return { ...state, loadingGrants: false, grants: payload };
    }

    case 'LIST_GRANTS_FAIL': {
      return { ...state, loadingGrants: false, error: payload };
    }

    default: {
      return state;
    }
  }
};
