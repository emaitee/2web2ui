import config from '../config';

import { sparkpost as sparkpostRequest } from 'src/helpers/axiosInstances';

const { authentication } = config;

// TODO handle timeout error better

function useRefreshToken(refreshToken) {
  return sparkpostRequest({
    method: 'POST',
    url: '/authenticate',
    data: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    headers: authentication.headers
  });
}

function sparkpostLogin(username, password, rememberMe) {
  username = encodeURIComponent(username);
  password = encodeURIComponent(password);
  const data = `grant_type=password&username=${username}&password=${password}&rememberMe=${rememberMe}`;

  return sparkpostRequest({
    method: 'POST',
    url: '/authenticate',
    data,
    headers: authentication.headers
  });
}

export { sparkpostRequest, sparkpostLogin, useRefreshToken };
