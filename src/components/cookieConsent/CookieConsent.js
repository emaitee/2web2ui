import React from 'react';
import { connect } from 'react-redux';
import { UnstyledLink, Snackbar } from '@sparkpost/matchbox';

import { giveConsent } from 'src/actions/cookieConsent';

import styles from './CookieConsent.module.scss';

export const ConsentBar = ({ onDismiss }) => <div className={styles.CookieConsent}>
  <div className={styles.ConsentBar}>
    <Snackbar maxWidth={600} onDismiss={onDismiss}>We use cookies to offer you a better browsing experience, analyze site traffic, and personalize content and advertisements.  Read more about how we use cookies and how you can control them by visiting our <UnstyledLink external to={'https://www.sparkpost.com/policies/privacy/'}>Cookie Policy</UnstyledLink>.  Note that parts of our site will not function properly if you disable them.  If you continue to use this site without disabling cookies, you consent to our use of them.</Snackbar>
  </div>
</div>;

export class CookieConsent extends React.Component {
  storeConsent = () => {
    this.props.giveConsent();
  };

  render() {
    const { consentGiven } = this.props;

    if (consentGiven) {
      return null;
    }

    return <ConsentBar onDismiss={this.storeConsent}/>;
  }
}

// connect consent state, set consent action
export default connect(
  ({ cookieConsent: { consentGiven }}) => ({ consentGiven }),
  { giveConsent }
)(CookieConsent);

