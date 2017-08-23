import WebhooksList from './Webhooks/ListPage';
import WebhooksCreate from './Webhooks/CreatePage';
import WebhooksDetails from './Webhooks/DetailsPage';

const webhooks = {
  ListPage: WebhooksList,
  CreatePage: WebhooksCreate,
  DetailsPage: WebhooksDetails
};

export { webhooks };
export * from './settings/Profile';
export * from './Dashboard';
export * from './Templates';
export { default as AuthPage } from './AuthPage';
export { default as SummaryReportPage } from './reports/SummaryPage';
export { default as TemplatesPage } from './Templates';
