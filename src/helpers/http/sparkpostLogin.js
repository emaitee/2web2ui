import config from 'src/config';
import { sparkpost as sparkpostRequest } from 'src/helpers/axiosInstances';

export default function sparkpostLogin(username, password, rememberMe) {
  username = encodeURIComponent(username);
  password = encodeURIComponent(password);
  const data = `grant_type=password&username=${username}&password=${password}&rememberMe=${rememberMe}`;

  return sparkpostRequest({
    method: 'POST',
    url: '/authenticate',
    data,
    headers: config.authentication.headers
  });
}
