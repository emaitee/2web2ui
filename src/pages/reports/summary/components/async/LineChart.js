/*
  This component is meant to be loaded asynchronously, do not import directly.
  See ../LineChart.js for async export
*/

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import _ from 'lodash';
import moment from 'moment';
import './LineChart.scss';

function orderDesc(a, b) {
  return b.value - a.value;
}

export default class SpLineChart extends React.Component {
  renderLines() {
    const { lines = []} = this.props;
    return lines.map((line) => {
      const lineProps = {
        strokeWidth: 2,
        activeDot: { r: 6 },
        dot: false,
        type: 'linear',
        ...line
      };
      return <Line {...lineProps} />;
    });
  }

  renderReferenceLines() {
    const { referenceLines = []} = this.props;
    return referenceLines.map((props) => <ReferenceLine {...props} />);
  }

  getYDomain() {
    const { yLabel, yScale } = this.props;
    const minDomain = yScale === 'log' ? 0.001 : 0;
    let maxDomain = 100; // Defaults to 100 max domain so y axis always renders at least 0 - 100

    if (yLabel !== 'Percent') {
      const max = this.getMax();
      maxDomain = max ? `dataMax + ${max * 0.08}` : maxDomain; // Adds 8% top 'padding'
    }

    return [minDomain, maxDomain];
  }

  // Gets max value for this LineChart
  getMax() {
    const { lines, data } = this.props;
    const lineData = _.flatten(lines.map((line) => data.map((d) => d[line.key])));
    return _.max(lineData);
  }

  // Manually generates Y axis ticks
  getYTicks() {
    const { yLabel, yScale } = this.props;
    if (yLabel === 'Percent' && yScale === 'linear') {
      return { ticks: [0, 25, 50, 75, 100]};
    }

    return {};
  }

  // Manually generates X axis ticks
  getXTicks() {
    const { data, precision } = this.props;

    if (precision === '1min') {
      // Show ticks every 15 minutes
      return { ticks: data.map((tick) => tick.ts).filter((time) => moment(time).minutes() % 15 === 0) };
    } else if (precision === '15min') {
      // Show ticks every 30 minutes
      return { ticks: data.map((tick) => tick.ts).filter((time) => moment(time).minutes() % 30 === 0) };
    }

    return {};
  }

  render() {
    const {
      data,
      lines = [],
      syncId,
      xTickFormatter = _.identity,
      yTickFormatter = _.identity,
      yScale = 'linear', // eslint-disable-line
      tooltipLabelFormatter = _.identity,
      tooltipValueFormatter = _.identity,
      showXAxis,
      yLabel
    } = this.props;

    const yDomain = this.getYDomain();
    const yTicks = this.getYTicks();
    const xTicks = this.getXTicks();

    return (
      <div className='sp-linechart-wrapper'>
        <ResponsiveContainer width='99%' height={150 + (40 * lines.length)}>
          <LineChart data={data} syncId={syncId}>
            <CartesianGrid vertical={false} strokeDasharray="4 1"/>
            <XAxis
              tickFormatter={xTickFormatter}
              {...xTicks}
              scale='utcTime'
              dataKey='ts'
              interval='preserveEnd'
              height={30}
              hide={!showXAxis} />
            <YAxis
              tickFormatter={yTickFormatter}
              {...yTicks}
              tickLine={false}
              width={60}
              scale={yScale}
              domain={yDomain}
              allowDataOverflow={yScale === 'log'} />
            <Tooltip
              labelFormatter={tooltipLabelFormatter}
              formatter={tooltipValueFormatter}
              itemSorter={orderDesc} />
            {this.renderReferenceLines()}
            {this.renderLines()}
          </LineChart>
        </ResponsiveContainer>
        <span className='sp-linechart-yLabel'>{yLabel}</span>
      </div>
    );
  }
}