import React, { Component } from 'react';
import { Panel, Grid } from '@sparkpost/matchbox';
import { Percent } from 'src/components/formatters';

import styles from './MetricsSummary.module.scss';

class MetricsSummary extends Component {
  render() {
    const { children, rateValue, rateTitle } = this.props;

    return (
      <Panel accent>
        <Grid>
          <Grid.Column lg={3}>
            <div className={styles.panelvertical}>
              <h1 className={styles.Large}><Percent value={rateValue} /></h1>
              <h6 className={styles.Caption}>{rateTitle}</h6>
            </div>
          </Grid.Column>
          <Grid.Column>
            <div className={styles.panelvertical}>
              <p className={styles.Description}>
                {children}
              </p>
            </div>
          </Grid.Column>
        </Grid>
      </Panel>
    );
  }
}

export default MetricsSummary;
