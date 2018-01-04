/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { TableCollection, Empty, LongTextContainer } from 'src/components';
import { addFilter, refreshTypeaheadCache } from 'src/actions/reportFilters';
import { loadDelayReasonsByDomain, loadDelayMetrics } from 'src/actions/delayReport';
import { parseSearch, getFilterSearchOptions, getShareLink } from 'src/helpers/reports';
import { Percent } from 'src/components/formatters';
import { showAlert } from 'src/actions/globalAlert';
import { Page, Panel, UnstyledLink } from '@sparkpost/matchbox';
import ShareModal from '../components/ShareModal';
import Filters from '../components/Filters';
import PanelLoading from 'src/components/panelLoading/PanelLoading';
import MetricsSummary from '../components/MetricsSummary';
import moment from 'moment';

const columns = [{ label: 'Reason', width: '45%' }, 'Domain', 'Delayed', 'Delayed First Attempt (%)'];

export class DelayPage extends Component {
  state = {
    modal: false,
    link: ''
  }

  componentDidMount() {
    this.handleRefresh(this.parseSearch());
    this.props.refreshTypeaheadCache();
  }

  parseSearch = () => {
    const { options, filters } = parseSearch(this.props.location.search);

    if (filters) {
      filters.forEach(this.props.addFilter);
    }

    return options;
  }

  handleRefresh = (options) => this.props.loadDelayMetrics(options)
    .then(() => this.updateLink())
    .then(() => this.props.loadDelayReasonsByDomain(options))
    .catch((err) => {
      this.props.showAlert({ type: 'error', message: 'Unable to refresh delay report.', details: err.message });
    });

  handleModalToggle = (modal) => {
    this.setState({ modal: !this.state.modal });
  }

  updateLink = () => {
    const { filters, history } = this.props;
    const options = getFilterSearchOptions(filters);
    const { link, search } = getShareLink(options);

    this.setState({ link });
    history.replace({ pathname: '/reports/delayed', search });
  }

  handleDomainClick = (domain) => {
    this.props.addFilter({ type: 'Recipient Domain', value: domain });
    this.handleRefresh();
  }

  getRowData = (rowData) => {
    const { totalAccepted } = this.props;
    const { reason, domain, count_delayed, count_delayed_first } = rowData;
    return [
      <LongTextContainer text={reason} />,
      <UnstyledLink onClick={() => this.handleDomainClick(domain)}>{domain}</UnstyledLink>,
      count_delayed,
      <span>{count_delayed_first} (<Percent value={(count_delayed_first / totalAccepted) * 100} />)</span>
    ];
  }

  renderCollection() {
    const { tableLoading, reasons } = this.props;

    if (tableLoading) {
      return <PanelLoading />;
    }

    if (!reasons) {
      return <Empty title={'Delayed Messages'} message={'No delay reasons to report'} />;
    }

    return <TableCollection
      columns={columns}
      rows={reasons}
      getRowData={this.getRowData}
      pagination={true}
    />;
  }

  renderTopLevelMetrics() {
    // need to control handling 1 hour/day/month
    moment.updateLocale('en', {
      relativeTime: {
        h: 'hour',
        d: 'day',
        M: 'month'
      }
    });

    const { aggregatesLoading, aggregates, filters } = this.props;
    const from = moment(filters.from);
    const to = moment(filters.to);
    const range = from.to(to, true);

    if (aggregatesLoading) {
      return <PanelLoading />;
    }

    return <MetricsSummary
      rateValue={(aggregates.count_delayed_first / aggregates.count_accepted) * 100}
      rateTitle={'Delayed Rate'}>
      { aggregates.count_delayed && <span><strong>{aggregates.count_delayed.toLocaleString()}</strong> of your messages were delayed of <strong>{aggregates.count_accepted.toLocaleString()}</strong> messages accepted in <strong>last {range}</strong>.</span> }
    </MetricsSummary>;

  }

  render() {
    const { modal, link } = this.state;

    return (
      <Page title='Delay Report'>
        <Filters refresh={this.handleRefresh} onShare={this.handleModalToggle} />
        { this.renderTopLevelMetrics() }
        <Panel title='Delayed Messages' className='ReasonsTable'>
          { this.renderCollection() }
        </Panel>
        <ShareModal
          open={modal}
          handleToggle={this.handleModalToggle}
          link={link} />
      </Page>
    );
  }
}

const mapStateToProps = (state) => {
  const tableLoading = state.delayReport.aggregatesLoading || state.delayReport.reasonsLoading;
  const aggregates = state.delayReport.aggregates;

  return {
    filters: state.reportFilters,
    tableLoading,
    reasons: state.delayReport.reasons,
    totalAccepted: aggregates ? aggregates.count_accepted : 1,
    aggregates,
    aggregatesLoading: state.delayReport.aggregatesLoading
  };
};

const mapDispatchToProps = {
  refreshTypeaheadCache,
  addFilter,
  loadDelayReasonsByDomain,
  loadDelayMetrics,
  showAlert
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DelayPage));
