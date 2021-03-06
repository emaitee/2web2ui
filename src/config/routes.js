/* eslint-disable max-lines */
import {
  apiKeys,
  AuthPage,
  SSOPage,
  billing,
  DashboardPage,
  sendingDomains,
  RegisterPage,
  reports,
  recipientLists,
  SmtpPage,
  suppressions,
  subaccounts,
  templates,
  trackingDomains,
  users,
  webhooks,
  ipPools,
  PageNotFound,
  DefaultRedirect,
  JoinPage,
  passwordReset
} from 'src/pages';

import onboarding from 'src/pages/onboarding';
import { default as emailVerification } from 'src/components/emailVerification/EmailVerification';
import { emailVerificationRedirect, emailRedirects } from './emailRoutes';

import { hasGrants, all, not } from 'src/helpers/conditions';
import { isEnterprise } from 'src/helpers/conditions/account';
import { isHeroku, isAzure } from 'src/helpers/conditions/user';
import { configFlag, configEquals } from 'src/helpers/conditions/config';


import App from 'src/components/layout/App';

import { DEFAULT_REDIRECT_ROUTE } from 'src/constants';

/**
 *  Angular UI Grant List:
    dashboard: ['api_keys/manage', 'templates/modify', 'sending_domains/manage'],
    credentials: ['api_keys/manage'],
    billing: ['account/manage'],
    domains: ['sending_domains/manage'], // make domains
    profile: ['users/self-manage'],
    security: ['users/self-manage'],
    sendingDomains: ['sending_domains/manage'],
    subaccounts: ['subaccount/manage', 'api_keys/manage', 'sending_domains/manage'],
    smtp: ['api_keys/manage'],
    trackingDomains: ['tracking_domains/view'],
    usage: ['account/manage'],
    users: ['users/manage'],
    webhooks: ['webhooks/view'],
    templates: ['templates/modify'],
    templatesView: ['templates/view'],
    transmit: ['transmissions/modify'],
    recipientLists: ['recipient_lists/manage'],
    suppressions: ['suppression_lists/manage'],
    ipPools: ['ip_pools/manage']
 */

/**
  * Reporting user grants:
  * metrics/view
  * message_events/view
  * templates/view
  * templates/preview
  * sending_domains/view
  * adaptive-delivery/view
  * users/self-manage
  * grants/view
  * subaccount/view
  * messaging-tools/manage
  * support/manage
  */

const routes = [
  {
    path: '/',
    public: true,
    redirect: '/auth'
  },
  {
    path: '/auth',
    public: true,
    component: AuthPage
  },
  {
    path: '/sso',
    public: true,
    component: SSOPage
  },
  {
    path: '/register',
    public: true,
    forceLogout: true,
    component: RegisterPage
  },
  {
    path: '/join',
    public: true,
    forceLogout: true,
    component: JoinPage,
    condition: configFlag('featureFlags.has_signup')
  },
  {
    path: '/forgot-password',
    public: true,
    forceLogout: true,
    component: passwordReset.ForgotPasswordPage
  },
  {
    path: '/reset-password/:token',
    public: true,
    forceLogout: true,
    component: passwordReset.ResetPasswordPage
  },

  /**
   * This "DefaultRedirect" route is where we send _everyone_ once they first
   * log in, through Auth or Register or SSO or anything else. It will display
   * a loading icon until the access control state is loaded, then make a decision
   * on where to send them based on config, role, etc.
   *
   * TODO: Once the Dashboard is universally accessible, this can probably go away
   */
  {
    path: DEFAULT_REDIRECT_ROUTE,
    component: DefaultRedirect,
    layout: App,
    condition: () => true // this route MUST be accessible to all logged-in app users
  },

  /**
   * Handles route redirects for cutover to GA from old email template links
   * TODO: Should remove at a later date
   */
  ...emailRedirects,

  {
    path: '/dashboard',
    component: DashboardPage,
    layout: App,
    condition: all(
      hasGrants('api_keys/manage', 'templates/modify', 'sending_domains/manage'),
      configEquals('splashPage', '/dashboard') // want to hide if not a splash page https://jira.int.messagesystems.com/browse/FAD-6046
    )
    // TODO: implement some kind of blockedRoutes check that runs on every route so we can
    // hide routes based on config, account/user settings, etc. without having to mess
    // around with grants in the web UI keys
  },
  {
    path: '/reports',
    redirect: '/reports/summary'
  },
  {
    path: '/reports/summary',
    component: reports.SummaryPage,
    layout: App
  },
  {
    path: '/reports/bounce',
    component: reports.BouncePage,
    layout: App
  },
  {
    path: '/reports/rejections',
    component: reports.RejectionPage,
    layout: App
  },
  {
    path: '/reports/accepted',
    component: reports.AcceptedPage,
    layout: App
  },
  {
    path: '/reports/delayed',
    component: reports.DelayPage,
    layout: App
  },
  {
    path: '/reports/engagement',
    component: reports.EngagementPage,
    layout: App
  },
  {
    path: '/reports/message-events',
    component: reports.MessageEventsPage,
    layout: App
  },
  {
    path: '/reports/message-events/details/:messageId',
    component: reports.EventPage,
    layout: App
  },
  {
    path: '/account/security',
    redirect: '/account/profile'
  },
  {
    path: '/account/email-verification/:token',
    component: emailVerification
  },
  {
    path: '/account/subaccounts',
    component: subaccounts.ListPage,
    condition: hasGrants('subaccount/manage', 'api_keys/manage', 'sending_domains/manage'),
    layout: App
  },
  {
    path: '/account/subaccounts/create',
    component: subaccounts.CreatePage,
    condition: hasGrants('subaccount/manage', 'api_keys/manage', 'sending_domains/manage'),
    layout: App
  },
  {
    path: '/account/subaccounts/:id',
    component: subaccounts.DetailsPage,
    condition: hasGrants('subaccount/manage', 'api_keys/manage', 'sending_domains/manage'),
    layout: App,
    exact: false
  },
  {
    path: '/account/users',
    component: users.ListPage,
    condition: hasGrants('users/manage'),
    layout: App
  },
  {
    path: '/account/users/create',
    component: users.CreatePage,
    condition: hasGrants('users/manage'),
    layout: App
  },
  {
    path: '/templates',
    component: templates.ListPage,
    condition: hasGrants('templates/view'),
    layout: App
  },
  {
    path: '/templates/create/:id?',
    component: templates.CreatePage,
    condition: hasGrants('templates/modify'),
    layout: App
  },
  {
    path: '/templates/edit/:id',
    component: templates.EditPage,
    condition: hasGrants('templates/view'),
    layout: App
  },
  {
    path: '/templates/edit/:id/published',
    component: templates.PublishedPage,
    condition: hasGrants('templates/view'),
    layout: App
  },
  {
    path: '/templates/preview/:id',
    component: templates.PreviewDraftPage,
    condition: hasGrants('templates/view'),
    layout: App
  },
  {
    path: '/templates/preview/:id/published',
    component: templates.PreviewPublishedPage,
    condition: hasGrants('templates/view'),
    layout: App
  },
  {
    path: '/lists/recipient-lists',
    component: recipientLists.ListPage,
    condition: hasGrants('recipient_lists/manage'),
    layout: App
  },
  {
    path: '/lists/recipient-lists/create',
    component: recipientLists.CreatePage,
    condition: hasGrants('recipient_lists/manage'),
    layout: App
  },
  {
    path: '/lists/recipient-lists/edit/:id',
    component: recipientLists.EditPage,
    condition: hasGrants('recipient_lists/manage'),
    layout: App
  },
  {
    path: '/lists/suppressions',
    component: suppressions.ListPage,
    condition: hasGrants('suppression_lists/manage'),
    layout: App
  },
  {
    path: '/lists/suppressions/create',
    component: suppressions.CreatePage,
    condition: hasGrants('suppression_lists/manage'),
    layout: App
  },
  {
    path: '/webhooks',
    component: webhooks.ListPage,
    condition: hasGrants('webhooks/view'),
    layout: App
  },
  {
    path: '/webhooks/create',
    component: webhooks.CreatePage,
    condition: hasGrants('webhooks/modify'),
    layout: App
  },
  {
    path: '/webhooks/details/:id',
    component: webhooks.DetailsPage,
    condition: hasGrants('webhooks/modify'),
    layout: App,
    exact: false
  },
  {
    path: '/account/api-keys',
    component: apiKeys.ListPage,
    condition: hasGrants('api_keys/manage'),
    layout: App
  },
  {
    path: '/account/api-keys/create',
    component: apiKeys.CreatePage,
    condition: hasGrants('api_keys/manage'),
    layout: App
  },
  {
    path: '/account/api-keys/details/:id',
    component: apiKeys.DetailsPage,
    condition: hasGrants('api_keys/manage'),
    layout: App
  },
  {
    path: '/account/tracking-domains',
    component: trackingDomains.ListPage,
    condition: hasGrants('tracking_domains/view'),
    layout: App
  },
  {
    path: '/account/tracking-domains/create',
    component: trackingDomains.CreatePage,
    condition: hasGrants('tracking_domains/manage'),
    layout: App
  },
  {
    path: '/account/profile',
    component: emailVerificationRedirect,
    condition: hasGrants('users/self-manage'),
    layout: App
  },
  {
    path: '/account/sending-domains',
    component: sendingDomains.ListPage,
    condition: hasGrants('sending_domains/manage'),
    layout: App
  },
  {
    path: '/account/sending-domains/create',
    component: sendingDomains.CreatePage,
    condition: hasGrants('sending_domains/manage'),
    layout: App
  },
  {
    path: '/account/sending-domains/edit/:id',
    component: sendingDomains.EditPage,
    condition: hasGrants('sending_domains/manage'),
    layout: App
  },
  {
    path: '/account/smtp',
    component: SmtpPage,
    condition: hasGrants('api_keys/manage'),
    layout: App
  },
  {
    path: '/account/billing',
    component: billing.SummaryPage,
    condition: all(hasGrants('account/manage'), not(isEnterprise), not(isHeroku), not(isAzure)),
    layout: App
  },
  {
    path: '/account/billing/plan',
    component: billing.ChangePlanPage,
    condition: all(hasGrants('account/manage'), not(isEnterprise), not(isHeroku), not(isAzure)),
    layout: App
  },
  {
    path: '/account/ip-pools',
    component: ipPools.ListPage,
    condition: hasGrants('ip_pools/manage'),
    layout: App
  },
  {
    path: '/account/ip-pools/create',
    component: ipPools.CreatePage,
    condition: hasGrants('ip_pools/manage'),
    layout: App
  },
  {
    path: '/account/ip-pools/edit/:id',
    component: ipPools.EditPage,
    condition: hasGrants('ip_pools/manage'),
    layout: App
  },
  {
    path: '/onboarding/plan',
    component: onboarding.ChoosePlan,
    condition: configFlag('featureFlags.has_signup')
  },
  {
    path: '/onboarding/sending-domain',
    component: onboarding.SendingDomainPage,
    condition: configFlag('featureFlags.has_signup')
  },
  {
    path: '/onboarding/email',
    component: onboarding.SmtpOrApiPage,
    condition: configFlag('featureFlags.has_signup')
  },
  {
    path: '/onboarding/email/smtp',
    component: onboarding.SmtpPage,
    condition: configFlag('featureFlags.has_signup')
  },
  {
    path: '/onboarding/email/api',
    component: onboarding.ApiPage,
    condition: configFlag('featureFlags.has_signup')
  }
];

// ensure 404 is always last in routes
routes.push({
  path: '*',
  component: PageNotFound,
  layout: App
});

export default routes;
