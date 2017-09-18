const initialState = {
  grants: [],
  keys: [],
  loadingGrants: false,
  loadingKeys: false,
  error: null
};

export default (state = initialState, { payload, type }) => {
  switch (type) {
    // FETCH_API_KEYS
    case 'FETCH_API_KEYS_PENDING': {
      return { ...state, loadingKeys: true, error: null };
    }

    case 'FETCH_API_KEYS_SUCCESS': {
      return { ...state, loadingKeys: false, keys: payload };
    }

    case 'FETCH_API_KEYS_FAIL': {
      return { ...state, loadingKeys: false, error: payload };
    }

    // FETCH_GRANTS
    case 'FETCH_GRANTS_PENDING': {
      return { ...state, loadingGrants: true, error: null };
    }

    case 'FETCH_GRANTS_SUCCESS': {
      return { ...state, loadingGrants: false, grants: payload };
    }

    case 'FETCH_GRANTS_FAIL': {
      return { ...state, loadingGrants: false, error: payload };
    }

    default: {
      return state;
    }
  }
};
