import _ from 'lodash';
import _fp from 'lodash/fp';

export function overviewProps(state) {
  const { subscription } = state.account;

  return {
    loading: !Object.keys(state.account).length || state.billing.plansLoading,
    hasBillingAccount: !!state.billing,
    plans: selectPublicPlans(state),
    currentPlan: selectCurrentPlan(state),
    subscription
  };
}

/**
 * Get public plans from state and sorts them by volume
 */
export function selectPublicPlans(state) {
  return state.billing.plans
   ? _.sortBy(state.billing.plans.filter((plan) => plan.status === 'public'), (plan) => plan.volume)
   : [];
}

/**
 * Gets current plan
 */
export function selectCurrentPlan(state) {
  return state.billing.plans && Object.keys(state.account).length
    ? _.find(state.billing.plans, { code: state.account.subscription.code })
    : {};
}

/**
 * Gets IP pools and formats for select options
 */
export function selectIpPools(state) {
  return _fp.flow(
    _fp.reject({ id: 'default' }),
    _fp.sortBy(({ name }) => name.toLowerCase()),
    _fp.map(({ name, id }) => ({ label: `${name} [${id}]`, value: id }))
  )(state.ipPools.list);
}
