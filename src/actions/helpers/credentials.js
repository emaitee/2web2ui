import { pickBy, trim, keys } from 'lodash';

import { getGrants } from 'selectors/credentials';

export function formatKeyForRequest(key, getState) {
  const request = { data: {}};

  if (key.subaccount) {
    request.headers = { 'X-MSYS-SUBACCOUNT': key.subaccount.id };
  }

  request.data.label = key.label;

  if (key.grantsRadio === 'all') {
    request.data.grants = keys(getGrants(getState()));
  } else {
    request.data.grants = keys(pickBy(key.grants));
  }

  if (key.validIps) {
    request.data.valid_ips = key.validIps.split(',').map(trim);
  }

  return request;
}
