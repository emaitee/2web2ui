import { createSelector } from 'reselect';
import _ from 'lodash';
import { onPlan } from 'src/helpers/conditions/account';

const suspendedSelector = (state) => state.account.isSuspendedForBilling;
const pendingSubscriptionSelector = (state) => state.account.pending_subscription;
const plansSelector = (state) => state.billing.plans || [];
const accountBillingSelector = (state) => state.account.billing;
const isFreeLegacyPlanSelector = (state) => onPlan('ccfree1')(state);

export const currentSubscriptionSelector = (state) => state.account.subscription;

/**
 * Returns current subscription's code
 * @param state
 * @return plan code
 */
export const currentPlanCodeSelector = createSelector(
  [currentSubscriptionSelector],
  (subscription) => subscription.code
);

/**
 * Returns true if user does not have pending plan change or is not suspended
 */
export const canChangePlanSelector = createSelector(
  [suspendedSelector, pendingSubscriptionSelector],
  (suspended, pendingSubscription) => !suspended && !pendingSubscription
);

/**
 * Get public plans from state and sorts them by volume
 */
export const publicPlansSelector = createSelector(
  [plansSelector],
  (plans) => _.sortBy(plans.filter((plan) => plan.status === 'public'), (plan) => plan.volume)
);

const awsPlans = createSelector(
  [plansSelector],
  (plans) => _.sortBy(plans.filter((plan) => plan.awsMarketplace === true), (plan) => plan.volume)
);


/**
 * Gets current plan
 */
export const currentPlanSelector = createSelector(
  [currentPlanCodeSelector, plansSelector],
  (currentPlanCode, plans) => _.find(plans, { code: currentPlanCode }) || {}
);

export const isAWSAccountSelector = createSelector(
  [currentSubscriptionSelector],
  (currentSubscription) => currentSubscription.type === 'aws'
);

/**
 * Returns true if user has billing account and they are on a paid plan
 */
export const canUpdateBillingInfoSelector = createSelector(
  [currentPlanSelector, accountBillingSelector, isFreeLegacyPlanSelector],
  (currentPlan, accountBilling, isFreeLegacyPlan) => (
    accountBilling && (isFreeLegacyPlan || !currentPlan.isFree)
  )
);

/**
 * Return true if plan can purchase IP and has billing info (except for aws as it'll be billed outside)
 */
export const canPurchaseIps = createSelector(
  [currentPlanSelector, accountBillingSelector, isAWSAccountSelector],
  (currentPlan, accountBilling, isAWSAccount) => currentPlan.canPurchaseIps === true && !!(accountBilling || isAWSAccount)
);

export const getPlansSelector = createSelector(
  [publicPlansSelector, awsPlans, currentSubscriptionSelector, isAWSAccountSelector],
  (publicPlans, awsPlans, subscription, isAWSAccount) => {

    if (isAWSAccount) {
      return awsPlans;
    }

    // Strip free plans for manually billed accounts looking to convert
    return !subscription.self_serve ? publicPlans.filter((plan) => !plan.isFree) : publicPlans;
  }
);

export const selectBillingInfo = createSelector(
  [
    canUpdateBillingInfoSelector,
    canChangePlanSelector,
    canPurchaseIps,
    currentPlanSelector,
    getPlansSelector,
    isAWSAccountSelector
  ],
  (canUpdateBillingInfo, canChangePlan, canPurchaseIps, currentPlan, plans, isAWSAccount) => ({
    canUpdateBillingInfo,
    canChangePlan,
    canPurchaseIps,
    currentPlan,
    plans,
    isAWSAccount
  })
);
