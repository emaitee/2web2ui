import React from 'react';
import { PublicRoute, ProtectedRoute, AuthenticationGate } from 'src/components/auth';
import { CookieConsent, Support, GlobalAlertWrapper, RouteWatch } from 'src/components';
import SiftScience from 'src/components/siftScience/SiftScience';
import Layout from 'src/components/layout/Layout';
import routes from 'src/config/routes';
import config from 'src/config';

import {
  BrowserRouter as Router,
  Redirect,
  Switch
} from 'react-router-dom';

const App = () => (
  <Router>
    <div>
      {config.siftScience && <SiftScience config={config.siftScience} />}
      <RouteWatch />
      <AuthenticationGate />
      <CookieConsent />
      <Layout>
        <Switch>
          {
            routes.map((route) => {
              const MyRoute = route.public ? PublicRoute : ProtectedRoute;

              route.exact = !(route.exact === false); // this makes exact default to true

              if (route.redirect) {
                return <Redirect key={route.path} exact from={route.path} to={route.redirect} />;
              }

              return <MyRoute key={route.path} {...route} />;
            })
          }
        </Switch>
      </Layout>
      <Support />
      <GlobalAlertWrapper />
    </div>
  </Router>
);

export default App;
