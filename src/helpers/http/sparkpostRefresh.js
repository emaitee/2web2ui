import config from 'src/config';
import { sparkpost as sparkpostAxios } from 'src/helpers/axiosInstances';

export default function(refreshToken) {
  // call API for a new token
  return sparkpostAxios({
    method: 'POST',
    url: '/authenticate',
    data: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    headers: config.authentication.headers
  });
}
