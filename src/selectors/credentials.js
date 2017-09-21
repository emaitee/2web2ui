import { find, fromPairs, isEmpty, join, keyBy, map, size } from 'lodash';
import { createSelector } from 'reselect';

/*
 * generic credentials selectors
 */
const getApiKeys = (state) => state.credentials.keys;
const getGrantsArray = (state) => state.credentials.grants;
const getSubaccounts = (state) => state.subaccounts.list;
const getApiKeyId = (state, props) => props.match.params.id;

const getKeysLoading = (state) => state.credentials.keysLoading;
const getGrantsLoading = (state) => state.credentials.grantsLoading;
const getSubaccountsLoading = (state) => state.subaccounts.listLoading;

export const getApiKey = createSelector(
  [getApiKeys, getApiKeyId],
  (apiKeys, id) => find(apiKeys, { id })
);

// Convert grants array to an object keyed by `grant.key`
export const getGrants = createSelector(getGrantsArray, (grants) =>
  keyBy(grants, 'key')
);

export const getLoading = createSelector(
  [getKeysLoading, getGrantsLoading, getSubaccountsLoading],
  (keysLoading, grantsLoading, subaccountsLoading) =>
    keysLoading || grantsLoading || subaccountsLoading
);

/*
 * ApiKeyForm selectors
 */
const getFormApiKey = (state, props) => props.apiKey || {};

export const getIsNew = createSelector(getFormApiKey, (apiKey) =>
  isEmpty(apiKey)
);

export const getInitialGrantsRadio = createSelector(
  [getGrants, getFormApiKey, getIsNew],
  (grants, apiKey, isNew) =>
    isNew || size(grants) <= size(apiKey.grants) ? 'all' : 'select'
);

export const getInitialSubaccount = createSelector(
  [getSubaccounts, getFormApiKey],
  (subaccounts, apiKey) => find(subaccounts, { id: apiKey.subaccount_id })
);

export const getInitialValues = createSelector(getFormApiKey, (apiKey) => {
  // using lodash methods here allow us to handle undefined values nicely.
  const grantsPairs = map(apiKey.grants, (grant) => [grant, 'true']);
  const grants = fromPairs(grantsPairs);
  const validIps = join(apiKey.valid_ips, ', ');

  return {
    ...apiKey,
    grants,
    validIps
  };
});
