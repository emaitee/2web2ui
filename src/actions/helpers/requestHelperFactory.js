import axios from 'axios';

function defaultOnSuccess({ types, response, dispatch, meta, action }) {
  dispatch({
    type: types.SUCCESS,
    payload: response,
    meta
  });

  return response;
}

function defaultOnFail({ types, err, dispatch, meta, action }) {
  const { message, response = {}} = err;

  dispatch({
    type: types.FAIL,
    payload: { message, response },
    meta
  });
}

export default function requestFactory({
  request = axios,
  onSuccess = defaultOnSuccess,
  onFail = defaultOnFail,
  transformHttpOptions = (opts) => opts
} = {}) {
  return (action) => (dispatch, getState) => {
    const { type = 'NO_TYPE_DEFINED', meta } = action;
    const { url, method = 'get', params, headers, data } = meta;
    const types = {
      PENDING: `${type}_PENDING`,
      SUCCESS: `${type}_SUCCESS`,
      FAIL: `${type}_FAIL`
    };

    // standardize method included in meta from here on out
    meta.method = method.toLowerCase();

    dispatch({
      type: types.PENDING,
      meta
    });

    const httpOptions = {
      method: meta.method,
      url,
      params,
      headers,
      data
    };

    const transformedHttpOptions = transformHttpOptions(httpOptions, getState);

    return request(transformedHttpOptions)
      .then(
        // request succeeded, we only get here if the request returned a 2xx status code
        (response) => onSuccess({ types, response, dispatch, meta, action, getState }),

        // request failed (remember to throw err in your onFail)
        (err) => {
          onFail({ types, err, dispatch, meta, action, getState });
          return { error: err }
        }
      );
  };
}
