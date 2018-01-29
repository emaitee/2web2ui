import React, { Component } from 'react';
import { Loading } from 'src/components/loading/Loading';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import selectAccessConditionState from 'src/selectors/accessConditionState';
import config from 'src/config';

export class DefaultRedirect extends Component {

  componentDidMount() {
    this.handleRedirect();
  }

  componentDidUpdate() {
    this.handleRedirect();
  }

  handleRedirect() {
    const { location, history, currentUser, ready } = this.props;
    const { state: routerState = {}} = location;

    // if there is a redirect route set on state, we can
    // redirect there before access condition state is ready
    if (routerState.redirectAfterLogin) {
      history.push(routerState.redirectAfterLogin, { replace: true });
      return;
    }

    // if access condition state hasn't loaded, we can't
    // make a redirect decision yet
    if (!ready) {
      return;
    }

    // reporting users are all sent to the summary report
    if (currentUser.access_level === 'reporting') {
      history.push('/reports/summary', { replace: true });
      return;
    }

    // everyone else is sent to the config.splashPage route
    history.push(config.splashPage, { replace: true });
  }

  render() {
    return <Loading />;
  }
}

const mapStateToProps = (state) => selectAccessConditionState(state);
export default withRouter(connect(mapStateToProps)(DefaultRedirect));
