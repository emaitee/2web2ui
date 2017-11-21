import { sparkpostLogin } from '../helpers/http';
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
  // return a thunk
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

        // TODO: handle a timeout error better

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

export function beginRefresh(refreshToken) {
  return { type: 'ATTEMPTING_REFRESH', payload: refreshToken };
}

export function refresh(access_token, refresh_token) {
  const newCookie = authCookie.merge({ access_token, refresh_token });
  return login(newCookie);
}

export function logout() {
  return (dispatch) => {
    authCookie.remove();
    dispatch({
      type: 'LOGOUT'
    });
  };
}
