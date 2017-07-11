import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import classnames from 'classnames';

import { Panel, ProgressBar } from '@sparkpost/matchbox';
import styles from './UsageReport.module.scss';

const actions = [
  {
    content: 'What counts towards usage?',
    to: 'https://support.sparkpost.com/customer/portal/articles/2750871',
    external: true
  }
];

const getPercent = (used, volume) => Math.floor((volume / used) * 100);

const DisplayNumber = ({ label, content, orange }) => (
  <div className={styles.Display}>
    <h5 className={classnames(styles.Content, orange && styles.orange)}>{ content }</h5>
    <h6 className={styles.Label}>{ label }</h6>
  </div>
);

const ProgressLabel = ({ title, secondaryTitle }) => (
    <div>
      <h5 className={styles.ProgressTitle}>{ title }</h5>
      <h6 className={styles.ProgressSecondary}>{ secondaryTitle }</h6>
    </div>
);

class UsageReport extends Component {
  render () {
    const { subscription, usage } = this.props;

    if (!subscription || !usage) {
      return null; // TODO figure out loading state or is this ok
    }

    const remaining = subscription.plan_volume - usage.month.used;
    const overage = remaining < 0 ? Math.abs(remaining) : 0;

    const dailyUsage = getPercent(usage.day.limit, usage.day.used);
    const monthlyUsage = getPercent(
      usage.month.limit !== subscription.plan_volume ? usage.month.limit : subscription.plan_volume,
      usage.month.used
    );

    // idk how to add commas to numbers but toLocaleString works
    const dailyLimitMarkup = usage.day.limit
      ? <DisplayNumber label='Daily Limit' content={usage.day.limit.toLocaleString()}/>
      : null;

    const overageMarkup = overage
      ? <DisplayNumber label='Extra Emails Used' content={overage.toLocaleString()}/>
      : null;

    const monthlyLimitMarkup = usage.month.limit && usage.month.limit !== subscription.plan_volume
      ? <DisplayNumber label='Monthly limit' content={usage.month.limit.toLocaleString()} />
      : null;

    return (
      <Panel title='Your Usage Report' actions={actions}>
        <Panel.Section>

          <ProgressLabel
            title='Today'
            secondaryTitle={`Since ${moment(usage.day.start).format('MMMM Do, YYYY h:mma')}`}
          />
          <ProgressBar completed={dailyUsage} />
          <DisplayNumber label='Used' content={usage.day.used.toLocaleString()} orange />
          { dailyLimitMarkup }

        </Panel.Section>
        <Panel.Section>

          <ProgressLabel
            title='This Month'
            secondaryTitle={`Billing cycle: ${moment(usage.month.start).format('MMMM D')} - ${moment(usage.month.end).format('MMMM D')}`}
          />
          <ProgressBar completed={monthlyUsage} />
          <DisplayNumber label='Used' content={usage.month.used.toLocaleString()} orange />
          <DisplayNumber label='Included' content={subscription.plan_volume.toLocaleString()}/>
          { overageMarkup }
          { monthlyLimitMarkup }

        </Panel.Section>
      </Panel>
    );
  }
}

const mapStateToProps = ({ account: { usage, subscription } }) => ({ usage, subscription });
export default connect(mapStateToProps)(UsageReport);