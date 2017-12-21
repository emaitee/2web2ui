import { format, subDays } from 'date-fns';
import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';

const apiFormat = 'YYYY-MM-DDTHH:MM';
const defaultParams = () => ({
  from: format(subDays(Date.now(), 30), apiFormat)
});

export function fetch({ type = 'FETCH_METRICS', path, params = {}}) {
  return sparkpostApiRequest({
    type,
    meta: {
      method: 'GET',
      url: `/metrics/${path}`,
      params: {
        ...defaultParams(),
        ...params
      }
    }
  });
}

export function fetchMetricsDomains(params = {}) {
  const type = 'FETCH_METRICS_DOMAINS';
  const path = 'domains';
  return fetch({ type, path, params });
}

export function fetchMetricsCampaigns(params = {}) {
  const type = 'FETCH_METRICS_CAMPAIGNS';
  const path = 'campaigns';
  return fetch({ type, path, params });
}

export function fetchMetricsSendingIps(params = {}) {
  const type = 'FETCH_METRICS_SENDING_IPS';
  const path = 'sending-ips';
  return fetch({ type, path, params });
}

export function fetchMetricsIpPools(params = {}) {
  const type = 'FETCH_METRICS_IP_POOLS';
  const path = 'ip-pools';
  return fetch({ type, path, params });
}

export function fetchDeliverability(params = {}) {
  const path = 'deliverability';
  return fetch({ path, params });
}

export function getTimeSeries(params = {}) {
  const path = 'deliverability/time-series';
  return fetch({ path , params });
}

export function fetchBounceClassifications(params = {}) {
  const type = 'FETCH_METRICS_BOUNCE_CLASSIFICATIONS';
  const path = 'deliverability/bounce-classification';
  return fetch({ type, path, params });
}

export function fetchBounceReasons(params = {}) {
  const type = 'FETCH_METRICS_BOUNCE_REASONS';
  const path = 'deliverability/bounce-reason';
  return fetch({ type, path, params });
}

export function fetchBounceReasonsByDomain(params = {}) {
  const type = 'FETCH_METRICS_BOUNCE_REASONS_BY_DOMAIN';
  const path = 'deliverability/bounce-reason/domain';
  return fetch({ type, path, params });
}

export function fetchDelayReasonsByDomain(params = {}) {
  const type = 'FETCH_METRICS_DELAY_REASONS_BY_DOMAIN';
  const path = 'deliverability/delay-reason/domain';
  return fetch({ type, path, params });
}
