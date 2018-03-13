const testConfig = {
  apiBase: 'http://fake-api-test-host.com',
  splashPage: '/dashboard',
  smtpAuth: {
    host: 'smtp.sparkmail.com',
    alternativePort: 2525
  },
  authentication: {
    cookie: {
      name: 'test',
      options: {
        path: '/'
      }
    }
  },
  cookieConsent: {
    cookie: {
      name: 'cookieConsent',
      ageDays: 365,
      options: {
        path: '/'
      }
    }
  }
};

export default testConfig;
