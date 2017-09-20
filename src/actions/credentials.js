import { formatKeyForRequest } from './helpers/credentials';
import sparkpostApiRequest from './helpers/sparkpostApiRequest';

export function listApiKeys() {
  return (dispatch, getState) => {
    if (getState().credentials.keys.length) {
      return;
    }

    return dispatch(
      sparkpostApiRequest({
        type: 'LIST_API_KEYS',
        meta: {
          method: 'GET',
          url: '/api-keys'
        }
      })
    );
  };
}

export function createApiKey(key) {
  return (dispatch, getState) =>
    dispatch({
      type: 'CREATE_API_KEY',
      meta: {
        method: 'POST',
        url: '/api-keys',
        ...formatKeyForRequest(key, getState)
      }
    });
}

export function deleteApiKey(id) {
  return {
    type: 'DELETE_API_KEY',
    meta: {
      method: 'DELETE',
      url: `/api-keys/${id}`
    }
  };
}

export function updateApiKey(id, key) {
  return (dispatch, getState) =>
    dispatch({
      type: 'UPDATE_API_KEY',
      meta: {
        method: 'PUT',
        url: `/api-keys/${id}`,
        ...formatKeyForRequest(key, getState)
      }
    });
}

export function listGrants() {
  return (dispatch, getState) => {
    if (getState().credentials.grants.length) {
      return;
    }

    dispatch(
      sparkpostApiRequest({
        type: 'LIST_GRANTS',
        meta: {
          method: 'GET',
          url: '/authenticate/grants'
        }
      })
    );
  };
}
