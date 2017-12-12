import React from 'react';
import { ProtectedRoute, AuthenticationGate } from 'src/components/auth';
import { Layout, GlobalAlertWrapper } from 'src/components';
import routes from 'src/config/routes';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  withRouter
} from 'react-router-dom';

class _RouteWatch extends React.Component {
  componentDidUpdate(prevProps) {
    if (prevProps.location !== this.props.location) {
      this.trackPageview();
    }
  }

  trackPageview() {
    if (window.gtag) {
      // TODO: Do we want to include the search query here? i think no because it destroys the page view stats
      // but maybe we need to handle those a different way instead
      // TODO: move this to an abstract helper, later can have an "event" helper too easily
      window.gtag('config', 'UA-111136819-2', { page_path: this.props.location.pathname });
    }
  }

  render() {
    return null;
  }
}
const RouteWatch = withRouter(_RouteWatch);

const App = () => (
  <Router>
    <div>
      <RouteWatch />
      <AuthenticationGate />
      <Layout>
        <Switch>
          {
            routes.map((route) => {
              const MyRoute = route.public ? Route : ProtectedRoute;

              route.exact = !(route.exact === false); // this makes exact default to true

              if (route.redirect) {
                return <Redirect key={route.path} exact from={route.path} to={route.redirect} />;
              }

              return <MyRoute key={route.path} {...route} />;
            })
          }
        </Switch>
      </Layout>
      <GlobalAlertWrapper />
    </div>
  </Router>
);

export default App;
