import { sparkpost as sparkpostAxios } from 'src/helpers/axiosInstances';
import { resolveOnCondition } from 'src/helpers/promise';
import { refresh, logout } from 'src/actions/auth';
import config from 'src/config';
import _ from 'lodash';
import store from 'src/store';

const { dispatch, getState } = store;
const maxRetries = _.get(config, 'authentication.maxRefreshRetries', 3);

/**
 * Promise-based retry logic, retries callSparkpostApi call
 * when the auth.refreshing flag goes back to false
 *
 * @param {Object} options - same options that callSparkpostApi requires
 */
export function retryAfterRefresh(request, retries) {
  return resolveOnCondition(() => !getState().auth.refreshing)
    .then(() => callSparkpostApi(request, retries));
}

/**
 * Intermediary "promise factory" function
 *
 * @param {Object} request
 * @return {Function} - "Thunk"
 */
export function asyncSparkpostHelper(request) {
  return () => callSparkpostApi(request);
}

/**
 * Direct function used to kick off a SparkPost API HTTP request
 *
 * @param {Object} request - Axios request object
 * @param {Number|undefined} retries - number representing how many times this request has been retried
 */
export function callSparkpostApi(request, retries = 0) {
  const { auth = {}} = getState();

  // add Authorization header if user is logged in
  if (auth.loggedIn) {
    _.set(request, 'headers.Authorization', auth.token);
  }

  // if we're already refreshing the token, wait until we're done and retry request
  if (auth.refreshing) {
    return retryAfterRefresh(request, retries);
  }

  // make the HTTP call
  return sparkpostAxios(request)
    // transform success response
    .then(({ data: { results }}) => results)

    // handle error cases
    .catch((error) => {
      const { response } = error;
      const { auth = {}} = getState();

      // if we have a 401 and a refresh token is present, attempt a token refresh
      if (response.status === 401 && auth.refreshToken && retries < maxRetries) {
        dispatch(refresh());
        return retryAfterRefresh(request, retries + 1);
      }

      // if we have a 403 or a 401 and we're not refreshing, log the user out
      if (response.status === 401 || response.status === 403) {
        return dispatch(logout());
      }

      // otherwise throw the error and let it be handled by the async dispatcher
      throw error;
    });
}
