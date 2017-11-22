import { sparkpostLogin, sparkpostRefresh } from 'src/helpers/http';
import authCookie from '../helpers/authCookie';
import { initializeAccessControl } from './accessControl';

export function login(authData) {
  return (dispatch) => {
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: authData
    });

    dispatch(initializeAccessControl());
  };
}

export function authenticate(username, password, rememberMe = false) {
  return (dispatch, getState) => {
    const { loggedIn } = getState().auth;

    if (loggedIn) {
      return;
    }

    dispatch({ type: 'LOGIN_PENDING' });

    sparkpostLogin(username, password, rememberMe)
      .then(({ data = {}} = {}) => {
        const payload = { ...data, username };

        // save auth cookie
        authCookie.save(payload);

        // dispatch login success event
        dispatch(login(payload));
      })
      .catch((err) => {
        const { response = {}} = err;
        const { data = {}} = response;
        const { error_description: errorDescription } = data;

        dispatch({
          type: 'LOGIN_FAIL',
          payload: {
            errorDescription
          }
        });
      });
  };
}

export function confirmPassword(username, password) {
  return (dispatch, getState) => {
    dispatch({ type: 'CONFIRM_PASSWORD' });

    return sparkpostLogin(username, password, false)
      .then(({ data = {}} = {}) => {
        const payload = { ...data, username };

        // dispatch login success event
        dispatch({
          type: 'CONFIRM_PASSWORD_SUCCESS',
          payload
        });
      })
      .catch((err) => {
        const { response = {}} = err;
        const { data = {}} = response;
        const { error_description: errorDescription } = data;
        dispatch({
          type: 'CONFIRM_PASSWORD_FAIL',
          payload: {
            errorDescription
          }
        });
        throw err;
      });
  };
}

/**
 * Attempts to refresh the auth token for
 * the SparkPost API
 */
export function refresh() {
  return (dispatch, getState) => {
    const { auth = {}} = getState();

    if (auth.refreshing) {
      return;
    }

    dispatch({ type: 'ATTEMPTING_REFRESH', payload: auth.refreshToken });

    return sparkpostRefresh(auth.refreshToken)
      // save new token results in cookie and store
      .then(({ data: { access_token, refresh_token }} = {}) => {
        const newCookie = authCookie.merge({ access_token, refresh_token });
        return dispatch(login(newCookie));
      })
      // log out on any failure in this process
      .catch(() => dispatch(logout()));
  };
}

export function logout() {
  return (dispatch) => {
    authCookie.remove();
    dispatch({
      type: 'LOGOUT'
    });
  };
}
