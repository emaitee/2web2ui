import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { addFilters } from 'src/actions/reportOptions';
import { refreshDelayReport } from 'src/actions/delayReport';
import { selectReportSearchOptions } from 'src/selectors/reportSearchOptions';
import { Page, Panel } from '@sparkpost/matchbox';
import ReportOptions from 'src/pages/reports/components/ReportOptions';
import PanelLoading from 'src/components/panelLoading/PanelLoading';
import MetricsSummary from '../components/MetricsSummary';
import DelaysDataTable from './components/DelaysDataTable';
import { safeRate } from 'src/helpers/math';

export class DelayPage extends Component {

  componentDidUpdate(prevProps) {
    if (prevProps.reportOptions !== this.props.reportOptions) {
      this.props.refreshDelayReport(this.props.reportOptions);
    }
  }

  renderDataTable() {
    const { loading, reasons, totalAccepted } = this.props;

    if (loading) {
      return <PanelLoading />;
    }

    return <DelaysDataTable totalAccepted={totalAccepted} rows={reasons} addFilters={this.props.addFilters} />;
  }

  renderTopLevelMetrics() {
    const { aggregatesLoading, aggregates } = this.props;
    const { count_delayed_first, count_accepted } = aggregates;

    if (aggregatesLoading) {
      return <PanelLoading minHeight='115px' />;
    }

    if (_.isEmpty(aggregates)) {
      return null;
    }

    return (
      <MetricsSummary
        rateValue={safeRate(count_delayed_first, count_accepted)}
        rateTitle='Delayed Rate'
        secondaryMessage={`${count_delayed_first.toLocaleString()} were delayed on first attempt.`}
      >
        <strong>{count_delayed_first.toLocaleString()}</strong> of your messages were delayed of <strong>{count_accepted.toLocaleString()}</strong> messages accepted
      </MetricsSummary>
    );
  }

  render() {
    const { loading, searchOptions } = this.props;

    return (
      <Page title='Delay Report'>
        <ReportOptions reportLoading={loading} searchOptions={searchOptions} />
        { this.renderTopLevelMetrics() }
        <Panel title='Delayed Messages' className='ReasonsTable'>
          { this.renderDataTable() }
        </Panel>
      </Page>
    );
  }
}

const mapStateToProps = (state) => {
  const { aggregates } = state.delayReport;
  return {
    loading: state.delayReport.aggregatesLoading || state.delayReport.reasonsLoading,
    reasons: state.delayReport.reasons,
    totalAccepted: aggregates ? aggregates.count_accepted : 1,
    aggregates,
    aggregatesLoading: state.delayReport.aggregatesLoading,
    reportOptions: state.reportOptions,
    searchOptions: selectReportSearchOptions(state)
  };
};

const mapDispatchToProps = {
  addFilters,
  refreshDelayReport
};

export default connect(mapStateToProps, mapDispatchToProps)(DelayPage);
