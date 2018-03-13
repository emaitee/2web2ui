import React from 'react';
import { connect } from 'react-redux';
import { UnstyledLink, Snackbar } from '@sparkpost/matchbox';

import { giveConsent } from 'src/actions/cookieConsent';

import styles from './CookieConsent.module.scss';

export const ConsentBar = ({ onDismiss }) => <div className={styles.CookieConsent}>
  <div className={styles.ConsentBar}>
    <Snackbar maxWidth={600} onDismiss={onDismiss}>By continuing to use this site you consent to the use of cookies on your device as described in our <UnstyledLink external to={'https://www.sparkpost.com/policies/privacy/'}>Privacy and Cookie Policy</UnstyledLink> unless you have disabled them. You can change your Cookie Settings at any time but parts of our site will not function correctly without them.</Snackbar>
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

