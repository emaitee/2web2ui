import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';

import { fetch as fetchMetrics } from 'actions/metrics';
import { getQueryFromOptions, getDayLines, getLineChartFormatters } from 'helpers/metrics';

import { Page, Button, Panel, Tabs, Tooltip } from '@sparkpost/matchbox';
import Layout from 'components/Layout/Layout';
import { Loading } from 'components/Loading/Loading';

import Filters from '../components/Filters';
import LineChart from './components/LineChart';
import List from './components/List';
import MetricsModal from './components/MetricsModal';

import _ from 'lodash';
import styles from './SummaryPage.module.scss';
// import qs from 'query-string';

class SummaryReportPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMetrics: false,
      eventTime: true,
      options: {
        metrics: ['count_targeted', 'count_delivered', 'count_accepted', 'count_bounce']
      }
    };
  }

  componentWillMount() {
    this.refresh();
  }

  renderLoading() {
    const { metricsData } = this.props;
    if (metricsData.pending) {
      return <div className={styles.Loading}><Loading /></div>;
    }
  }

  refresh = () => {
    const { to, from } = this.props.filter;

    if (this.props.metricsData.pending || (this.state.chartOptions === this.state.options)) {
      return;
    }

    const query = getQueryFromOptions({ ...this.state.options, to, from });

    this.props.fetchMetrics('deliverability/time-series', query)
      .then(() => this.setState({ chartOptions: {
        ...this.state.options,
        precision: query.precision
      }}));
  }

  createDayReferenceLines() {
    const { results = {}} = this.props.metricsData;
    const { chartOptions } = this.state;

    return getDayLines(results, chartOptions).map(({ ts }) => ({
      key: ts,
      x: ts,
      stroke: '#bbb',
      strokeWidth: 2
    }));
  }

  renderChart() {
    const { results = [], pending } = this.props.metricsData;
    const { chartOptions = false } = this.state;
    const { metrics = []} = chartOptions;

    if (!results.length || !chartOptions) {
      return null;
    }

    return (
      <LineChart
        data={results}
        lines={metrics.map((metric) => ({
          key: metric,
          dataKey: metric,
          name: formatMetricLabel(metric),
          stroke: pending ? '#f8f8f8' : false
        }))}
        {...getLineChartFormatters(chartOptions)}
        referenceLines={this.createDayReferenceLines()}
      />
    );
  }

  handleMetricsApply = () => {

  }

  handleMetricsToggle = () => {
    this.setState({ showMetrics: !this.state.showMetrics });
  }

  handleTimeToggle = () => {
    this.setState({ eventTime: !this.state.eventTime });
  }

  renderTimeMode() {
    const { eventTime } = this.state;

    return eventTime
    ? <Tooltip content='Sort events by injection time'>
        <Button onClick={this.handleTimeToggle} className={styles.ButtonSpacer} size='small'>Event Time</Button>
      </Tooltip>
    : <Tooltip content='Sort events by event time'>
        <Button onClick={this.handleTimeToggle} className={styles.ButtonSpacer} size='small'>Injection Time</Button>
      </Tooltip>;
  }

  render() {
    const { metricsData } = this.props;

    return (
      <Layout.App>
        <Page title='Summary Report' />

        <Filters refresh={this.refresh}/>

        <Panel>
          <Panel.Section className={classnames(styles.ChartSection, metricsData.pending && styles.pending)}>
            {this.renderChart()}

            <div className={styles.Controls}>
              <Button size='small' onClick={this.handleMetricsToggle}>Select Metrics</Button>
              {this.renderTimeMode()}
              <Button.Group className={styles.ButtonSpacer}>
                <Button size='small' primary>Linear</Button>
                <Button size='small'>Log</Button>
              </Button.Group>
            </div>
          </Panel.Section>

          {this.renderLoading()}
        </Panel>

        <Tabs
          selected={0}
          tabs={[
            { content: 'Domains' },
            { content: 'Campaigns' },
            { content: 'Templates' }
          ]}/>
        <Panel>
          <List />
        </Panel>
        <MetricsModal
          open={this.state.showMetrics}
          handleToggle={this.handleMetricsToggle}
          handleApply={this.handleMetricsApply} />
      </Layout.App>
    );
  }
}

// this will be replaced with proper metrics config
function formatMetricLabel(name) {
  return _.startCase(name.replace(/^count_/, ''));
}
const mapStateToProps = ({ metrics, reportFilters }) => ({ metricsData: metrics, filter: reportFilters });
export default withRouter(connect(mapStateToProps, { fetchMetrics })(SummaryReportPage));
