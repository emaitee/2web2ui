/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Panel, Button, TextField, Grid } from '@sparkpost/matchbox';
import DomainTypeahead from './DomainTypeahead';
import { SelectWrapper } from 'src/components/reduxFormWrappers';
import { TableCollection } from 'src/components';
import { required } from 'src/helpers/validation';
import { TextFieldWrapper } from 'src/components';
import { selectCurrentPoolInitialValues, selectIpsForCurrentPool } from 'src/selectors/ipPools';
import isDefaultPool from '../helpers/defaultPool';

import { list as listDomains } from 'src/actions/sendingDomains';
import { selectReadyForDkim } from 'src/selectors/sendingDomains';

const columns = ['Sending IP', 'Hostname', 'IP Pool'];

export class PoolForm extends Component {
  componentDidMount() {
    this.props.listDomains();
  }

  poolSelect = (ip, poolOptions, submitting) => (<Field
    name={ip.id}
    component={SelectWrapper}
    options={poolOptions}
    disabled={submitting}/>
  );

  getRowData = (poolOptions, ip) => {
    const { submitting } = this.props;

    return [
      ip.external_ip,
      ip.hostname,
      this.poolSelect(ip, poolOptions, submitting)
    ];
  }

  renderCollection() {
    const { isNew, ips, list, pool: currentPool } = this.props;
    const poolOptions = list.map((pool) => ({
      value: pool.id,
      label: (pool.id === currentPool.id) ? '-- Change Pool --' : `${pool.name} (${pool.id})`
    }));
    const getRowDataFunc = this.getRowData.bind(this, poolOptions);

    // New pools have no IPs
    if (isNew) {
      return null;
    }

    // Loading
    if (!ips) {
      return null;
    }

    // Empty pool
    if (ips.length === 0) {
      return <p>Add sending IPs to this pool by moving them from their current pool.</p>;
    }

    return (
      <TableCollection
        columns={columns}
        rows={ips}
        getRowData={getRowDataFunc}
        pagination={false}
      />
    );
  }

  domainWarning() {
    const { domains } = this.props;

    if (!domains.length) {
      return 'You do not have any verified sending domains to use.';
    }

    return null;
  }

  render() {
    const { isNew, pool, handleSubmit, submitting, pristine } = this.props;
    const submitText = isNew ? 'Create IP Pool' : 'Update IP Pool';
    const editingDefault = isDefaultPool(pool.id);
    const helpText = editingDefault ? 'Sorry, you can\'t edit the default pool\'s name. Then it wouldn\'t be the default!' : '';

    return (
      <form onSubmit={handleSubmit}>
        <Panel.Section>
          <Field
            name="name"
            component={TextFieldWrapper}
            validate={required}
            label="Pool Name"
            disabled={editingDefault || submitting}
            helpText={helpText}
          />
        </Panel.Section>
        <Panel.Section>
          <Grid>
            <Grid.Column xs={6}>
              <Field
                name='domain.dkim'
                component={DomainTypeahead}
                label='Signing Domain'
                disabled={!this.props.domains.length}
                // validate={[required, emailOrSubstitution, this.validateDomain]}
                domains={this.props.domains}
                helpText={this.domainWarning()}
              />
            </Grid.Column>
            <Grid.Column xs={6}>
              <Field
                name='domain.fbl'
                component={DomainTypeahead}
                label='FBL Domain'
                disabled={!this.props.domains.length}
                // validate={[required, emailOrSubstitution, this.validateDomain]}
                domains={this.props.domains}
                // helpText={this.fromEmailWarning()}
              />
            </Grid.Column>
          </Grid>

        </Panel.Section>

        { this.renderCollection() }

        <Panel.Section>
          <Button submit primary disabled={submitting || pristine}>
            {submitting ? 'Saving' : submitText}
          </Button>
        </Panel.Section>
      </form>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { ipPools } = state;
  const { pool, list = []} = ipPools;

  return {
    list,
    pool,
    domains: selectReadyForDkim(state, props),
    ips: selectIpsForCurrentPool(state),
    initialValues: selectCurrentPoolInitialValues(state)
  };
};

const PoolReduxForm = reduxForm({ form: 'poolForm' })(PoolForm);
export default connect(mapStateToProps, { listDomains })(PoolReduxForm);
