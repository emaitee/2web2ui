import requestHelperFactory from './requestHelperFactory';
import _ from 'lodash';
import { zuora as zuoraAxios } from 'src/helpers/axiosInstances';
import { showAlert } from 'src/actions/globalAlert';

export default requestHelperFactory({
  request: zuoraAxios,
  onSuccess: ({ types, response, dispatch, meta }) => {
    if (!response.data.success) {
      const message = _.get(response, 'data.reasons[0].message', 'An error occurred while contacting the billing service');

      dispatch({
        type: types.FAIL,
        payload: { message, response },
        meta
      });

      const err = new Error(message);
      err.name = 'ZuoraApiError';
      err.response = response;

      // auto alert all errors
      dispatch(showAlert({ type: 'error', message }));

      throw err;
    }

    dispatch({
      type: types.SUCCESS,
      payload: response,
      meta
    });

    return response;
  }
});
