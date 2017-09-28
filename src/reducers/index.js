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

export default combineReducers({
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
