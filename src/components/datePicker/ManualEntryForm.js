import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { Grid, TextField, Icon } from '@sparkpost/matchbox';
import { DATE_FORMATS } from 'src/constants';
import styles from './ManualEntryForm.module.scss';

export default class ManualEntryForm extends Component {
  DATE_FORMAT = DATE_FORMATS.INPUT_DATE;
  TIME_FORMAT = DATE_FORMATS.INPUT_TIME;
  DEBOUNCE = 500;

  state = {
    toDate: '',
    toTime: '',
    fromDate: '',
    fromTime: ''
  }

  componentWillReceiveProps(nextProps) {
    this.syncPropsToState(nextProps);
  }

  syncPropsToState({ to, from }) {
    this.setState({
      toDate: moment(to).format(this.DATE_FORMAT),
      toTime: moment(to).format(this.TIME_FORMAT),
      fromDate: moment(from).format(this.DATE_FORMAT),
      fromTime: moment(from).format(this.TIME_FORMAT)
    });
  }

  handleFieldChange = (e, key) => {
    this.setState({ [key]: e.target.value });
    this.debounceChanges();
  }

  debounceChanges = _.debounce(() => {
    this.validate();
  }, this.DEBOUNCE);

  handleEnter = (e) => {
    if (e.key === 'Enter') {
      this.validate(e, true);
    }
  };

  handleBlur = (e) => {
    this.validate(e, true);
  }

  validate = (e, shouldReset) => {
    const format = `${this.DATE_FORMAT} ${this.TIME_FORMAT}`;
    const to = moment(`${this.state.toDate} ${this.state.toTime}`, format, true);
    const from = moment(`${this.state.fromDate} ${this.state.fromTime}`, format, true);

    // allow for prop-level override of "now" (DI, etc.)
    const { now = moment() } = this.props;

    if (to.isValid() && from.isValid() && from.isBefore(to) && to.isBefore(now)) {
      return this.props.selectDates({ to: to.toDate(), from: from.toDate() }, () => {
        if (e && e.key === 'Enter') {
          this.props.onEnter(e);
        }
      });
    } else if (shouldReset) {
      this.syncPropsToState(this.props); // Resets fields if dates are not valid
    }
  }

  render() {
    const { toDate, toTime, fromDate, fromTime } = this.state;

    return (
      <form onKeyDown={this.handleEnter} className={styles.DateFields}>
        <Grid middle='xs'>
          <Grid.Column >
            <TextField
              id="fieldFromDate"
              label='From Date' labelHidden placeholder='YYYY-MM-DD'
              onChange={(e) => this.handleFieldChange(e, 'fromDate')}
              onBlur={this.handleBlur}
              value={fromDate} />
          </Grid.Column>
          <Grid.Column >
            <TextField
              id="fieldFromTime"
              label='From Time' labelHidden placeholder='12:00am'
              onChange={(e) => this.handleFieldChange(e, 'fromTime')}
              onBlur={this.handleBlur}
              value={fromTime} />
          </Grid.Column>
          <Grid.Column xs={1}>
            <div className={styles.ArrowWrapper}>
              <Icon name='ArrowRight'/>
            </div>
          </Grid.Column>
          <Grid.Column >
            <TextField
              id="fieldToDate"
              label='To Date' labelHidden placeholder='YYYY-MM-DD'
              onChange={(e) => this.handleFieldChange(e, 'toDate')}
              onBlur={this.handleBlur}
              value={toDate} />
          </Grid.Column>
          <Grid.Column >
            <TextField
              id="fieldToTime"
              label='To Time' labelHidden placeholder='12:00am'
              onChange={(e) => this.handleFieldChange(e, 'toTime')}
              onBlur={this.handleBlur}
              value={toTime} />
          </Grid.Column>
        </Grid>
      </form>
    );
  }
}
