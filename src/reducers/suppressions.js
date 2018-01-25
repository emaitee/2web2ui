const initialState = { list: null, hasSuppressions: null, listLoading: false };

export default (state = initialState, action) => {
  const { meta } = action;

  switch (action.type) {
    case 'CHECK_SUPPRESSIONS_PENDING':
      return { ...state, listError: null };

    case 'CHECK_SUPPRESSIONS_SUCCESS':
      return { ...state, hasSuppression: Boolean((action.payload || []).length) };

    case 'CHECK_SUPPRESSIONS_FAIL':
      return { ...state, listError: action.payload };

    //fetch list
    case 'GET_SUPPRESSIONS_PENDING':
      return { ...state, listLoading: true, listError: null };

    case 'GET_SUPPRESSIONS_SUCCESS':
      return { ...state, list: action.payload, listLoading: false };

    case 'GET_SUPPRESSIONS_FAIL':
      return { ...state, listError: action.payload, listLoading: false };

    //recipients search
    case 'SEARCH_SUPPRESSIONS_RECIPIENT_PENDING':
      return { ...state, listLoading: true };

    case 'SEARCH_SUPPRESSIONS_RECIPIENT_SUCCESS':
      return { ...state, listLoading: false, list: action.payload };

    case 'SEARCH_SUPPRESSIONS_RECIPIENT_FAIL': {
      const { response = {}} = action.payload;
      if (response.status === 404) {
        return { ...state, listLoading: false, list: []};
      } else {
        return { ...state, listLoading: false, list: [], listError: action.payload };
      }
    }

    case 'DELETE_SUPPRESSION_PENDING':
      return { ...state, deleting: true };

    case 'DELETE_SUPPRESSION_SUCCESS':
      return { ...state, deleting: false, list: state.list.filter((s) => !(s.recipient === meta.suppression.recipient &&
        s.type === meta.suppression.type &&
        s.subaccount_id === meta.suppression.subaccount_id))
      };

    case 'DELETE_SUPPRESSION_FAIL':
      return { ...state, deleting: false, deleteError: action.payload };


    //reset results
    case 'RESET_SUPPRESSIONS_RESULTS':
      return { ...state, list: null };

    default:
      return state;
  }
};
