import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import qs from 'query-string';
import ErrorTracker from 'src/helpers/errorTracker';

import { SparkPost } from 'src/components';
import { Panel, UnstyledLink } from '@sparkpost/matchbox';
import PanelLoading from 'src/components/panelLoading/PanelLoading';
import RegisterUserForm from './RegisterUserForm';
import styles from './RegisterPage.module.scss';

import { registerUser, checkInviteToken } from 'src/actions/users';
import { authenticate, logout } from 'src/actions/auth';
import { DEFAULT_REDIRECT_ROUTE } from 'src/constants';

export class RegisterPage extends Component {

  onSubmit = (values) => {
    const { username, password } = values;
    return this.props.registerUser(this.props.token, values)
      .then(() => this.props.authenticate(username, password)
        .then(() => this.props.history.push(DEFAULT_REDIRECT_ROUTE))
        .catch((error) => {
          // user was created but auth failed, redirect to /auth
          this.props.history.push('/auth');
          ErrorTracker.report('sign-in', error);
        }))
      .catch((error) => ErrorTracker.report('register-user', error));
  }


  componentDidMount() {
    this.props.logout();
    this.props.checkInviteToken(this.props.token);
  }

  renderRegisterPanel() {
    const { invite, loading } = this.props;

    if (loading) {
      return <PanelLoading />;
    }

    if (invite.error) {
      return (
        <Panel.Section>
          <p>This invite has expired, please ask your account administrator to re-send your invitation</p>
        </Panel.Section>
      );
    }

    return (
      <Panel.Section>
        <p><small>{invite.from} invited you to join their SparkPost account.</small></p>
        <RegisterUserForm onSubmit={this.onSubmit} email={invite.email} />
      </Panel.Section>
    );
  }

  render() {
    const { token } = this.props;

    if (token === undefined) {
      return <Redirect to='/auth' />;
    }

    return (
      <div>
        <div className={styles.LogoWrapper}>
          <a href='https://www.sparkpost.com' title='SparkPost'>
            <SparkPost.Logo />
          </a>
        </div>

        <Panel accent title='Set Password'>
          { this.renderRegisterPanel() }
        </Panel>
        <UnstyledLink to='/auth'>Already signed up?</UnstyledLink>
      </div>
    );
  }
}

function mapStateToProps({ auth, users }, props) {
  return {
    token: qs.parse(props.location.search).token,
    invite: users.invite,
    loading: users.loading || auth.loginPending
  };
}

export default withRouter(connect(mapStateToProps, { registerUser, checkInviteToken, logout, authenticate })(RegisterPage));
