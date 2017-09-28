import requestHelperFactory from 'src/actions/helpers/requestHelperFactory';
import { refresh, logout } from 'src/actions/auth';
import { showAlert } from 'src/actions/globalAlert';
import { useRefreshToken } from 'src/helpers/http';
import { resolveOnCondition } from 'src/helpers/promise';
import _ from 'lodash';
import { sparkpost as sparkpostAxios } from './axiosInstances';

const maxRefreshRetries = 3;
export const refreshTokensUsed = new Set();
export let refreshing = false;

// Re-dispatches a given action after we finish refreshing the auth token
function redispatchAfterRefresh(action, dispatch) {
  return resolveOnCondition(() => !refreshing).then(() => dispatch(sparkpostRequest(action)));
}

const sparkpostRequest = requestHelperFactory({
  request: sparkpostAxios,
  transformHttpOptions: (options, getState) => {
    const { auth } = getState();
    const transformed = { ...options };
    if (auth.loggedIn) {
      _.set(transformed, 'headers.Authorization', auth.token);
    }
    return transformed;
  },
  onSuccess: ({ response, dispatch, types, meta }) => {
    const { data: { results }} = response;
    dispatch({
      type: types.SUCCESS,
      payload: results,
      meta
    });

    return results;
  },
  onFail: ({ types, err, dispatch, meta, action, getState }) => {
    const { message, response = {}} = err;
    const { auth } = getState();
    const { retries = 0 } = meta;

    // NOTE: if this is a 401 and we have a refresh token, we need to do a
    // refresh to get a new auth token and then re-dispatch this action
    if (response.status === 401 && auth.refreshToken && retries < maxRefreshRetries) {
      action.meta.retries = retries + 1;

      // If we are currently refreshing the token OR if this refresh token
      // has already been used to refresh, we should re-dispatch after refresh is complete
      if (refreshing || refreshTokensUsed.has(auth.refreshToken)) {
        return redispatchAfterRefresh(action, dispatch);
      }

      refreshing = true;
      refreshTokensUsed.add(auth.refreshToken);

      // call API for a new token
      return useRefreshToken(auth.refreshToken)

        // dispatch a refresh action to save new token results in cookie and store
        .then(({ data } = {}) => dispatch(refresh(data.access_token, data.refresh_token)))

        // dispatch the original action again, now that we have a new token ...
        // if anything in this refresh flow blew up, log out
        .then(
          // refresh token request succeeded
          () => {
            refreshing = false;
            return dispatch(sparkpostRequest(action));
          },
          // refresh token request failed
          (err) => {
            dispatch(logout());
            throw err;
          }
        );
    }

    // If we have a 403 or a 401 and we're not refreshing, log the user out silently
    if (response.status === 401 || response.status === 403) {
      dispatch(logout());
      throw err;
    }

    // any other API error should automatically fail, to be handled in the reducers/components
    dispatch({
      type: types.FAIL,
      payload: { message, response },
      meta
    });

    if (response.status >= 500) {
      dispatch(showAlert({ type: 'error', message: 'Something went wrong.', details: message }));
    }

    throw err;
  }
});

export default (action) => (dispatch, getState) => {
  // check for refreshing and exit early, otherwise call factory-made function
  if (refreshing) {
    return redispatchAfterRefresh(action, dispatch);
  }

  return dispatch(sparkpostRequest(action));
};
