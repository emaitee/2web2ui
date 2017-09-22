import { formatKeyForRequest } from './helpers/credentials';
import sparkpostApiRequest from './helpers/sparkpostApiRequest';
import { showAlert } from './globalAlert';

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
    ).then(() =>
      dispatch(
        showAlert({
          type: 'success',
          message: 'API key created'
        })
      )
    );
}

export function deleteApiKey(id) {
  return (dispatch) =>
    dispatch(
      sparkpostApiRequest({
        type: 'DELETE_API_KEY',
        meta: {
          method: 'DELETE',
          url: `/api-keys/${id}`
        }
      })
    ).then(() =>
      dispatch(
        showAlert({
          type: 'success',
          message: 'API key deleted'
        })
      )
    );
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
    ).then(() =>
      dispatch(
        showAlert({
          type: 'success',
          message: 'API key updated'
        })
      )
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
