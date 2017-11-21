export function getAsyncTypes(base) {
  return {
    PENDING: `${base}_PENDING`,
    SUCCESS: `${base}_SUCCESS`,
    FAIL: `${base}_FAIL`
  };
}

/**
 * Async Dispatcher is redux middleware that watches for actions
 * with an "async" key whose value is a thunk (i.e. a
 * function that accepts dispatch and getState functions from
 * the redux store) and returns a promise
 *
 * This middleware calls the thunk and chains onto the
 * returned promise to handle the 3 basic async actions:
 * PENDING, SUCCESS, and FAIL
 *
 * @param {Object} store
 * @param {Function} store.dispatch
 * @param {Function} store.getState
 */
export default function asyncDispatcherMiddleware({ dispatch, getState }) {
  return (next) => (action) => {
    const { type, async, meta = {}, payload: staticPayload = {}} = action;

    if (async && typeof async === 'function') {
      const types = getAsyncTypes(type);

      dispatch({ type: types.PENDING, payload: { baseType: type, meta, ...staticPayload }});

      return async(dispatch, getState)
        .then((result) => dispatch({
          type: types.SUCCESS,
          payload: { baseType: type, result, meta, ...staticPayload }
        }))
        .catch((error) => dispatch({
          type: types.FAIL,
          payload: { baseType: type, error, meta, ...staticPayload }
        }));
    }

    // otherwise let the action pass through
    return next(action);
  };
}
