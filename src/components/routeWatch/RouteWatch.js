import { Component } from 'react';
import { withRouter } from 'react-router-dom';

class RouteWatch extends Component {
  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.trackPageview();
    }
  }

  trackPageview() {
    if (window.gtag) {
      window.gtag('config', 'UA-111136819-2', { page_path: this.props.location.pathname });
    }
  }

  render() {
    return null;
  }
}

export default withRouter(RouteWatch);
