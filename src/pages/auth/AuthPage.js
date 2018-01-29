import React, { Component } from 'react';
import { connect } from 'react-redux';
import { authenticate, ssoCheck, login } from 'src/actions/auth';
import { verifyAndLogin } from 'src/actions/tfa';
import { SparkPost } from 'src/components';
import { Panel, Error } from '@sparkpost/matchbox';
import { SubmissionError } from 'redux-form';

import config from 'src/config';
import { DEFAULT_REDIRECT_ROUTE } from 'src/constants';
import LoginForm from './components/LoginForm';
import TfaForm from './components/TfaForm';
import styles from './AuthPage.module.scss';

export class AuthPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ssoEnabled: config.sso.enabled
    };
  }

  componentDidMount() {
    if (this.props.auth.loggedIn) {
      this.redirect();
      return;
    }
  }

  componentWillReceiveProps(nextProps) {
    const { ssoUser, loggedIn } = nextProps.auth;

    if (loggedIn) {
      this.redirect();
      return;
    }

    if (typeof ssoUser === 'undefined') { // we don't know if you're an ssoUser yet
      return;
    }

    if (ssoUser) {
      window.location.assign(`${config.apiBase}/users/saml/login`);
    } else {
      this.setState({ ssoEnabled: false });
    }
  }

  redirect() {
    this.props.history.push(DEFAULT_REDIRECT_ROUTE);
  }

  ssoSignIn(username) {
    return this.props.ssoCheck(username).catch((err) => err);
  }

  regularSignIn(username, password, rememberMe) {
    return this.props.authenticate(username, password, rememberMe);
  }

  renderLoginError(errorDescription) {
    return (
      <Error error={errorDescription} />
    );
  }

  loginSubmit = (values) => {
    const { username, password, rememberMe } = values;
    this.state.ssoEnabled ? this.ssoSignIn(username) : this.regularSignIn(username, password, rememberMe);
  }

  tfaSubmit = (values) => {
    const { code } = values;
    const { tfaEnabled, ...authData } = this.props.tfa;
    return this.props.verifyAndLogin({ authData, code }).catch((err) => {
      if (err.response.status === 400) {
        throw new SubmissionError({
          code: 'The code is invalid'
        });
      }
    });
  }

  render() {
    const { errorDescription } = this.props.auth;
    const { tfaEnabled } = this.props.tfa;

    return (
      <div>
        <div className={styles.LogoWrapper}>
          <a href="https://www.sparkpost.com" title="SparkPost">
            <SparkPost.Logo />
          </a>
        </div>

        <Panel sectioned accent title="Log In">
          { errorDescription && this.renderLoginError(errorDescription)}

          { tfaEnabled && <TfaForm onSubmit={this.tfaSubmit} /> }
          { !tfaEnabled && <LoginForm onSubmit={this.loginSubmit} ssoEnabled={this.state.ssoEnabled}/> }
        </Panel>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { auth, tfa } = state;
  return {
    auth,
    tfa
  };
};

export default connect(mapStateToProps, { login, verifyAndLogin, authenticate, ssoCheck })(AuthPage);
