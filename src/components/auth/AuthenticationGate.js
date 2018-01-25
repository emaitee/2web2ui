import { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import authCookie from 'src/helpers/authCookie';
import { login } from 'src/actions/auth';
import { getGrantsFromCookie } from 'src/actions/currentUser';

export class AuthenticationGate extends Component {
  componentWillMount() {
    const { auth } = this.props;
    if (auth.loggedIn && auth.token) {
      return;
    }

    const foundCookie = authCookie.get();
    if (foundCookie) {
      this.props.login({ authData: foundCookie });
      this.props.getGrantsFromCookie(foundCookie);
    }
  }

  componentDidUpdate(oldProps) {
    const { auth, history, location = {}} = this.props;
    // if logging out
    if (location.pathname !== '/auth' && oldProps.auth.loggedIn && !auth.loggedIn) {
      history.push('/auth');
    }
  }

  render() {
    return null;
  }
}

export default withRouter(connect(({ auth }) => ({ auth }), { login, getGrantsFromCookie })(AuthenticationGate));
