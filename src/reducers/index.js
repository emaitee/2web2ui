import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import account from './account';
import apiKeys from './api-keys';
import auth from './auth';
import billing from './billing';
import currentUser from './currentUser';
import globalAlert from './globalAlert';
import ipPools from './ipPools';
import metrics from './metrics';
import reportFilters from './reportFilters';
import sendingDomains from './sendingDomains';
import subaccounts from './subaccounts';
import summaryChart from './summaryChart';
import templates from './templates';
import webhooks from './webhooks';

const appReducer = combineReducers({
  account,
  auth,
  billing,
  apiKeys,
  currentUser,
  form,
  ipPools,
  globalAlert,
  metrics,
  reportFilters,
  sendingDomains,
  subaccounts,
  summaryChart,
  templates,
  webhooks
});

/**
 * Resets state to initial values on log out
 */
export default (state, action) => {
  if (action.type === 'LOGOUT') {
    state = undefined;
  }

  return appReducer(state, action);
};
