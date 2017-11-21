import { sparkpost as sparkpostAxios } from 'src/helpers/axiosInstances';
import attemptRefresh from 'src/helpers/http/sparkpostRefresh';
import { resolveOnCondition } from 'src/helpers/promise';
import { logout } from 'src/actions/auth';
import config from 'src/config';
import _ from 'lodash';

const maxRetries = _.get(config, 'authentication.maxRefreshRetries', 3);

function retryAfterRefresh(options) {
  return resolveOnCondition(() => !options.getState().auth.refreshing)
    .then(() => callSparkpostApi(options));
}

/**
 * Intermediary function that returns a "thunk" that will receive
 * dispatch and getState from redux, then call our own internal
 * __callSparkpostApi__ function which kicks off the HTTP request cycle
 *
 * @param {Object} request
 */
export function asyncSparkpostHelper(request) {
  return (dispatch, getState) => callSparkpostApi({ request, dispatch, getState });
}

/**
 * Direct function used to kick off a SparkPost API HTTP request cycle,
 * but needs access to getState and dispatch from redux so it can
 * manage getting the auth token from state and dispatching login/logout actions
 * during certain error cases
 *
 * @param {Object} options
 * @param {Object} options.request
 * @param {Function} options.dispatch
 * @param {Function} options.getState
 */
export function callSparkpostApi(options) {
  const { dispatch, getState, request, retries = 0 } = options;
  // TODO: throw error if dispatch, getState, or request is undefined?
  const { auth = {}} = getState();

  // add Authorization header if user is logged in
  if (auth.loggedIn) {
    _.set(request, 'headers.Authorization', auth.token);
  }

  // if we're already refreshing the token, wait until we're done and retry request
  if (auth.refreshing) {
    return retryAfterRefresh(options);
  }

  return sparkpostAxios(request)

    // transform success response
    .then(({ data: { results }}) => results)

    // handle error cases
    .catch((error) => {
      const { response } = error;
      const { auth = {}} = getState();

      // if we have a 401 and a refresh token is present, attempt a token refresh
      if (response.status === 401 && auth.refreshToken && retries < maxRetries) {
        // if we aren't already refreshing, attempt a refresh (log out on fail)
        if (!auth.refreshing) {
          attemptRefresh(auth.refreshToken, options).catch(() => dispatch(logout()));
        }

        // retry this request after the token is refreshed
        return retryAfterRefresh({ ...options, retries: options.retries + 1 });
      }

      // if we have a 403 or a 401 and we're not refreshing, log the user out
      if (response.status === 401 || response.status === 403) {
        return dispatch(logout());
      }

      // otherwise throw the error and let it be handled by the async dispatcher
      throw error;
    });
}
