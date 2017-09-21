import { formatKeyForRequest } from './helpers/credentials';
import sparkpostApiRequest from './helpers/sparkpostApiRequest';

export function createApiKey(key) {
  return (dispatch, getState) =>
    dispatch(
      sparkpostApiRequest({
        type: 'CREATE_API_KEY',
        meta: {
          method: 'POST',
          url: '/api-keys',
          ...formatKeyForRequest(key, getState)
        }
      })
    );
}

export function deleteApiKey(id) {
  return sparkpostApiRequest({
    type: 'DELETE_API_KEY',
    meta: {
      method: 'DELETE',
      url: `/api-keys/${id}`
    }
  });
}

export function updateApiKey(id, key) {
  return (dispatch, getState) =>
    dispatch(
      sparkpostApiRequest({
        type: 'UPDATE_API_KEY',
        meta: {
          method: 'PUT',
          url: `/api-keys/${id}`,
          ...formatKeyForRequest(key, getState)
        }
      })
    );
}

export function hideNewApiKey() {
  return {
    type: 'HIDE_NEW_API_KEY'
  };
}

export function listApiKeys() {
  return (dispatch, getState) => {
    if (getState().credentials.keysLoaded) {
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

export function listGrants() {
  return (dispatch, getState) => {
    if (getState().credentials.grantsLoaded) {
      return;
    }

    return dispatch(
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
