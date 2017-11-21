import { beginRefresh, refresh } from 'src/actions/auth';
import config from 'src/config';
import { sparkpost as sparkpostAxios } from 'src/helpers/axiosInstances';

export default function(refreshToken, options) {
  const { dispatch } = options;

  dispatch(beginRefresh(refreshToken));

  // call API for a new token
  return sparkpostAxios({
    method: 'POST',
    url: '/authenticate',
    data: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    headers: config.authentication.headers
  })

  // dispatch a refresh action to save new token results in cookie and store
  .then(({ data } = {}) => dispatch(refresh(data.access_token, data.refresh_token)));
}
