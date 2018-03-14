window.SP = window.SP || {};
window.SP.productionConfig = {
  apiBase: 'http://api.sparkpost.test/api/v1',
  cookieConsent: {
    cookie: {
      options: {
        domain: 'sparkpost.test'
      }
    }
  },
  featureFlags: {
    allow_mailbox_verification: true,
    allow_anyone_at_verification: true,
    has_signup: true
  },
  gaTag: 'UA-111136819-2',
  siftScience: {
    id: '88affa8e11'
  },
  splashPage: '/dashboard',
  smtpAuth: {
    host: 'smtp.sparkmail.com',
    alternativePort: 2525
  }
};
