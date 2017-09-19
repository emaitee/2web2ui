import { fromPairs, keyBy, map } from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, change, reduxForm, formValueSelector } from 'redux-form';
import { Button } from '@sparkpost/matchbox';

import { fetchGrants } from 'actions/credentials';
import { list as listSubaccounts } from 'actions/subaccounts';
// import SubaccountTypeahead from 'components/subaccountTypeahead/SubaccountTypeahead';
import {
  RadioGroup,
  TextFieldWrapper,
  SubaccountTypeaheadWrapper
} from 'components/reduxFormWrappers';
import GrantsCheckboxes from './GrantsCheckboxes';

const formName = 'apiKeyForm';
const grantsOptions = [
  { value: 'all', label: 'All' },
  { value: 'select', label: 'Select' }
];

const required = (value) => (value ? undefined : 'Required');

// TODO extract me? (selector?)
const formatValues = (apiKey) => {
  const grantsPairs = map(apiKey.grants, (grant) => [grant, 'true']);

  return {
    ...apiKey,
    grants: fromPairs(grantsPairs)
  };
};

export class ApiKeyForm extends Component {
  componentDidMount() {
    // TODO: listX or fetchX? consistency is key.
    this.props.fetchGrants();
    this.props.listSubaccounts();
  }

  onChangeSubaccount = (subaccount) => {
    this.props.formChange(formName, 'subaccount', subaccount);
  };

  render() {
    const {
      grants,
      subaccounts,
      isNew = false,
      handleSubmit,
      pristine,
      showGrants,
      submitSucceeded,
      submitting
    } = this.props;

    const submitText = isNew ? 'Create API Key' : 'Update API Key';

    return (
      <form onSubmit={handleSubmit}>
        <Field
          name="label"
          component={TextFieldWrapper}
          validate={required}
          label="API Key Name"
        />
        <Field
          name="subaccount"
          component={SubaccountTypeaheadWrapper}
          subaccounts={subaccounts}
        />
        <Field
          name="grantsRadio"
          component={RadioGroup}
          title="API Permissions"
          options={grantsOptions}
        />

        {showGrants && <GrantsCheckboxes grants={grants} />}

        <Button submit primary disabled={submitting || pristine}>
          {submitText}
        </Button>
        {submitting && !submitSucceeded && <div>Loading&hellip;</div>}
      </form>
    );
  }
}

const ApiKeyReduxForm = reduxForm({ form: formName })(ApiKeyForm);
const valueSelector = formValueSelector(formName);

const mapStateToProps = (state, props) => {
  // TODO: room for lots of selectors here
  const allGrants = state.credentials.grants;
  const { apiKey = { grants: []}, isNew } = props;
  const grants = keyBy(allGrants, 'key');
  const grantsRadio = valueSelector(state, 'grantsRadio');
  const initialValues = formatValues(apiKey);
  const initialGrantsRadio =
    isNew || allGrants.length <= apiKey.grants.length ? 'all' : 'select';

  const subaccounts = state.subaccounts.list.filter(
    (item) => item.compliance_status === 'active'
  );

  return {
    grants,
    subaccounts,
    showGrants: grantsRadio === 'select',
    initialValues: {
      grantsRadio: initialGrantsRadio,
      // subaccount: {},
      ...initialValues
    }
  };
};

export default connect(mapStateToProps, {
  formChange: change,
  fetchGrants,
  listSubaccounts
})(ApiKeyReduxForm);
