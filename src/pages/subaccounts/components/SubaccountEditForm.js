import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import { Button, Panel } from '@sparkpost/matchbox';
import { selectInitialSubaccountValues } from 'src/selectors/subaccounts';
import { NameField, IpPoolSelect, StatusSelect } from './formFields';

export class SubaccountEditForm extends Component {

  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      ipPools,
      compliance,
      reset
    } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <Panel.Section>
          <NameField disabled={submitting || compliance}/>

          { !!ipPools.length && <IpPoolSelect ipPools={ipPools} disabled={submitting || compliance} /> }

          <StatusSelect disabled={submitting || compliance} compliance={compliance} />
        </Panel.Section>
        <Panel.Section>
          <Button submit primary disabled={pristine || submitting || compliance}>
            { submitting ? 'Updating...' : 'Update' }
          </Button>
          { !pristine && <Button style={{ marginLeft: '1em' }} disabled={pristine || submitting} onClick={reset}>Cancel</Button> }
        </Panel.Section>
      </form>
    );
  }
}

const formName = 'SubaccountEditForm';

const mapStateToProps = (state, { subaccount }) => {
  const { compliance } = subaccount;

  return {
    ipPools: state.ipPools.list,
    compliance,
    initialValues: selectInitialSubaccountValues(subaccount)
  };
};

const SubaccountEditReduxForm = reduxForm({ form: formName })(SubaccountEditForm);
export default connect(mapStateToProps, {})(SubaccountEditReduxForm);
