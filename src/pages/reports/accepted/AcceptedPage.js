import React, { Component } from 'react';
import { connect } from 'react-redux';
import { refreshAcceptedReport } from 'src/actions/acceptedReport';
import { selectAcceptedAggregates, selectAcceptedAttempts } from 'src/selectors/acceptedReport';
import { Empty, PanelLoading } from 'src/components';
import { Page } from '@sparkpost/matchbox';
import ReportOptions from 'src/pages/reports/components/ReportOptions';
import AcceptedChart from './components/AcceptedChart';
import TopLevelMetrics from './components/TopLevelMetrics';
import _ from 'lodash';

export class AcceptedPage extends Component {

  componentWillReceiveProps(nextProps) {
    if (nextProps.reportOptions !== this.props.reportOptions) {
      this.props.refreshAcceptedReport(nextProps.reportOptions);
    }
  }

  // TODO: move this logic into <TopLevelMetrics>
  renderTopLevelMetrics() {
    const { loading, aggregates, metrics } = this.props;

    if (loading) {
      return <PanelLoading minHeight='120px' />;
    }

    if (_.isEmpty(aggregates)) {
      return null;
    }

    return <TopLevelMetrics aggregates={aggregates} metrics={metrics} />;
  }

  // TODO: move this logic into <AcceptedChart>
  renderChart() {
    const { loading, aggregates, attempts } = this.props;

    if (!loading && _.isEmpty(aggregates)) {
      return <Empty title='Accepted Rates' message='No accepted messages to report' />;
    }

    return <AcceptedChart loading={loading} aggregates={aggregates} attempts={attempts} />;
  }

  render() {
    const { loading } = this.props;
    return (
      <Page title='Accepted Report'>
        <ReportOptions reportLoading={loading} />
        {this.renderTopLevelMetrics()}
        {this.renderChart()}
      </Page>
    );
  }
}

const mapStateToProps = (state) => ({
  attempts: selectAcceptedAttempts(state),
  aggregates: selectAcceptedAggregates(state),
  metrics: state.acceptedReport.metrics,
  loading: state.acceptedReport.aggregatesLoading || state.acceptedReport.attemptsLoading,
  reportOptions: state.reportOptions
});

const mapDispatchToProps = {
  refreshAcceptedReport
};

export default connect(mapStateToProps, mapDispatchToProps)(AcceptedPage);
