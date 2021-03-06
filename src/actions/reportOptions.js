import {
  fetchMetricsDomains,
  fetchMetricsCampaigns,
  fetchMetricsSendingIps,
  fetchMetricsIpPools
} from './metrics';

import { listTemplates } from './templates';
import { list as listSubaccounts } from './subaccounts';
import { list as listSendingDomains } from './sendingDomains';
import { getRelativeDates } from 'src/helpers/date';
import { getQueryFromOptions } from 'src/helpers/metrics';

// array of all lists that need to be re-filtered when time changes
const metricLists = [
  fetchMetricsDomains,
  fetchMetricsCampaigns,
  fetchMetricsSendingIps,
  fetchMetricsIpPools
];

/**
 * Returns a thunk that initializes the non-metric lists used
 * for populating the typeahead cache (metrics lists are populated
 * during date range refreshes)
 *
 * The thunk skips calling any of the lists that already have values
 * in the redux store
 */
export function initTypeaheadCache() {
  return (dispatch, getState) => {
    const { templates, subaccounts, sendingDomains, metrics, reportOptions } = getState();
    const allCachesEmpty = ['domains', 'campaigns', 'sendingIps', 'ipPools'].every((cache) => (
      metrics[cache].length === 0
    ));
    const requests = [];

    if (templates.list.length === 0) {
      requests.push(dispatch(listTemplates()));
    }

    if (subaccounts.list.length === 0) {
      requests.push(dispatch(listSubaccounts()));
    }

    if (sendingDomains.list.length === 0) {
      requests.push(dispatch(listSendingDomains()));
    }

    if (allCachesEmpty) {
      requests.push(dispatch(refreshTypeaheadCache(reportOptions)));
    }

    return Promise.all(requests);
  };
}

export function refreshTypeaheadCache(options) {
  const params = getQueryFromOptions(options);
  return (dispatch) => {
    const requests = metricLists.map((list) => dispatch(list(params)));
    return Promise.all(requests);
  };
}

export function addFilters(payload) {
  return {
    type: 'ADD_FILTERS',
    payload
  };
}

export function removeFilter(payload) {
  return {
    type: 'REMOVE_FILTER',
    payload
  };
}

/**
 * Refreshes the date range for all reports
 *
 * Calculates relative ranges if a non-custom relativeRange value is present,
 * which will override passed in from/to dates
 *
 * @param {Object} update
 * @param {Date} update.from
 * @param {Date} update.to
 * @param {String} update.relativeRange
 */
export function refreshReportOptions(update) {
  return (dispatch, getState) => {
    const { reportOptions } = getState();
    update = { ...reportOptions, ...update };

    // calculate relative dates if range is not "custom"
    if (update.relativeRange && update.relativeRange !== 'custom') {
      update = { ...update, ...getRelativeDates(update.relativeRange) };
    }

    return dispatch({
      type: 'REFRESH_REPORT_OPTIONS',
      payload: update
    });
  };
}
