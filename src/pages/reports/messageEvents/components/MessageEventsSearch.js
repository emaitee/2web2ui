import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import _ from 'lodash';
import { getMessageEvents, refreshMessageEventsDateRange, updateMessageEventsSearchOptions, addFilters } from 'src/actions/messageEvents';
import { selectMessageEventsSearchOptions } from 'src/selectors/reportSearchOptions';
import { Panel, Grid, TextField } from '@sparkpost/matchbox';
import AdvancedFilters from './AdvancedFilters';
import ActiveFilters from './ActiveFilters';
import ShareModal from '../../components/ShareModal';
import DatePicker from 'src/components/datePicker/DatePicker';
import { email as emailValidator } from 'src/helpers/validation';
import { parseSearch } from 'src/helpers/messageEvents';
import { stringToArray } from 'src/helpers/string';
import { onEnter } from 'src/helpers/keyEvents';
import { RELATIVE_DATE_OPTIONS } from './searchConfig';

export class MessageEventsSearch extends Component {

  state = {
    recipientError: null
  }

  componentDidMount() {
    this.props.updateMessageEventsSearchOptions(parseSearch(this.props.location.search));
  }

  componentDidUpdate(prevProps) {
    const { search, getMessageEvents } = this.props;

    if (!_.isEqual(prevProps.search, search)) {
      getMessageEvents(search);
    }
  }

  getInvalidAddresses = (addresses) => {
    const invalids = _.filter(addresses, (address) => {
      address = _.trim(address);

      return address && emailValidator(address) !== undefined;
    });

    return invalids;
  }

  handleRecipientsChange = (event) => {
    const value = event.target.value;
    const recipients = stringToArray(value);
    const invalids = this.getInvalidAddresses(recipients);

    if (invalids.length) {
      this.setState({ recipientError: `${invalids.join(', ')} ${invalids.length > 1 ? 'are not' : 'is not a'} valid email ${invalids.length > 1 ? 'addresses' : 'address'}` });
      return;
    }

    event.target.value = '';
    this.setState({ recipientError: null });
    this.props.addFilters({ recipients });
  }

  render() {
    const { search, refreshMessageEventsDateRange, loading, now, searchOptions } = this.props;

    return (
      <Panel>
        <Panel.Section>
          <Grid>
            <Grid.Column xs={12} md={5}>
              <DatePicker
                {...search.dateOptions}
                relativeDateOptions={RELATIVE_DATE_OPTIONS}
                disabled={loading}
                onChange={refreshMessageEventsDateRange}
                datePickerProps={{
                  disabledDays: {
                    after: now,
                    before: moment(now).subtract(10, 'days').toDate()
                  },
                  canChangeMonth: false
                }}
              />
            </Grid.Column>
            <Grid.Column xs={12} md={3} xl={4}>
              <TextField
                labelHidden
                label="Recipient Email(s)"
                placeholder="Filter by recipient email address"
                onBlur={this.handleRecipientsChange}
                onKeyDown={onEnter(this.handleRecipientsChange)}
                onFocus={() => this.setState({ recipientError: null })}
                error={this.state.recipientError}
              />
            </Grid.Column>
            <Grid.Column xs={12} md={2}>
              <AdvancedFilters />
            </Grid.Column>
            <Grid.Column xs={12} md={2} xl={1}>
              <ShareModal disabled={loading} searchOptions={searchOptions} />
            </Grid.Column>
          </Grid>
        </Panel.Section>
        <ActiveFilters />
      </Panel>
    );
  }
}

const mapStateToProps = (state) => ({
  search: state.messageEvents.search,
  loading: state.messageEvents.loading,
  searchOptions: selectMessageEventsSearchOptions(state)
});
const mapDispatchToProps = { getMessageEvents, refreshMessageEventsDateRange, updateMessageEventsSearchOptions, addFilters };
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MessageEventsSearch));
