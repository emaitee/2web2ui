import { find, fromPairs, isEmpty, keyBy, map, size } from 'lodash';
import { createSelector } from 'reselect';

/*
 * generic credentials selectors
 */
const getApiKeys = (state) => state.credentials.keys;
const getGrantsArray = (state) => state.credentials.grants;
const getSubaccounts = (state) => state.subaccounts.list;
const getApiKeyId = (state, props) => props.match.params.id;

const getLoadingKeys = (state) => state.credentials.loadingKeys;
const getLoadingGrants = (state) => state.credentials.loadingGrants;
const getLoadingSubaccounts = (state) => state.subaccounts.listLoading;

export const getApiKey = createSelector(
  [getApiKeys, getApiKeyId],
  (apiKeys, id) => find(apiKeys, { id })
);

// Convert grants array to an object keyed by `grant.key`
export const getGrants = createSelector(getGrantsArray, (grants) =>
  keyBy(grants, 'key')
);

export const getLoading = createSelector(
  [getLoadingKeys, getLoadingGrants, getLoadingSubaccounts],
  (loadingKeys, loadingGrants, loadingSubaccounts) =>
    loadingKeys || loadingGrants || loadingSubaccounts
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
  // lodash.map lets us treat undefined nicely.
  const grantsPairs = map(apiKey.grants, (grant) => [grant, 'true']);

  return {
    ...apiKey,
    grants: fromPairs(grantsPairs)
  };
});
