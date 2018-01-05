import moment from 'moment';
import qs from 'query-string';
import _ from 'lodash';

/**
 * Creates search options object from shared report options. Page specific options not included (ie. summary chart selected metrics)
 * @param  {Object} filters - reportFilters state
 * @return {Object} - formatted search options object
 */
function getFilterSearchOptions(filters) {
  return {
    from: moment(filters.from).utc().format(),
    to: moment(filters.to).utc().format(),
    filters: filters.activeList.map((filter) => {
      const subaccount = filter.type === 'Subaccount' ? `:${filter.id}` : '';
      return `${filter.type}:${filter.value}${subaccount}`;
    })
  };
}

/**
 * Creates URL information from object
 * @param  {Object} options object of options you wish to stringify
 * @return {Object}
 *   {
 *     search - search string
 *     link - full url
 *   }
 */
function getShareLink(options) {
  const search = _.isEmpty(options) ? '' : `?${qs.stringify(options, { encode: false })}`;
  const link = `${window.location.href.split('?')[0]}${search}`;
  return { search, link };
}

/**
 * Parses search string
 * @param  {string} search - location.search
 * @return {Object}
 *   {
 *     options - options for refresh actions
 *     filters - array of objects ready to be called with reportFilters.addFilter action
 *   }
 */
function parseSearch(search) {
  let options = {};
  let filtersList;

  if (!search) {
    return { options };
  }

  const { from, to, metrics = [], filters = []} = qs.parse(search);

  const metricsList = typeof metrics === 'string' ? [metrics] : metrics;
  filtersList = typeof filters === 'string' ? [filters] : filters;

  filtersList = filtersList.map((filter) => {
    const parts = filter.split(':');
    const type = parts.shift();
    let value;
    let id;

    // Subaccount filters include 3 parts
    // 'Subaccount:1234 (ID 554):554' -> { type: 'Subaccount', value: '1234 (ID 554)', id: '554' }
    if (type === 'Subaccount') {
      value = parts[0];
      id = parts[1];
    } else {
      value = parts.join(':');
    }

    return { value, type, id };
  });

  options = {
    metrics: metricsList,
    from: new Date(from),
    to: new Date(to)
  };

  // Filters are not passed to metrics refresh actions
  return { options, filters: filtersList };
}

function humanizeTimeRange(from, to) {
  // need to control how to handle 1 hour/day/month
  moment.updateLocale('en', {
    relativeTime: {
      h: 'hour',
      d: '24 hours',
      M: '30 days'
    }
  });

  from = moment(from);
  to = moment(to);
  return from.to(to, true);
}

export {
  getFilterSearchOptions,
  getShareLink,
  humanizeTimeRange,
  parseSearch
};
