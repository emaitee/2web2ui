import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { unregister } from 'src/helpers/registerServiceWorker';
import ErrorTracker from 'src/helpers/errorTracker';
import store from 'src/store';
import config from 'src/config';

import './critical.scss';
import './index.scss';
import App from './App';

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
unregister(); // our bundle is currently too big to be added to SW cache, causing problems on every deploy

// Kill loading screen
document.getElementById('critical').className += ' ready';

// Set up the Sentry error tracker
ErrorTracker.install(config, store);

/**
 * Track unhandled promise rejects
 *
 * @param {PromiseRejectionEvent} event
 * @param {Error} event.reason
 */
window.onunhandledrejection = ({ reason }) => {
  ErrorTracker.report('onunhandledrejection', reason);
};
