import { fromPairs, keyBy, map } from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { Button } from '@sparkpost/matchbox';

import { fetchGrants } from 'actions/credentials';
import { RadioGroup, TextFieldWrapper } from 'components/reduxFormWrappers';
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
    this.props.fetchGrants();
  }

  render() {
    const {
      grants,
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
          component={TextFieldWrapper}
          label="Subaccount"
          placeholder="None"
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
  const { grants: allGrants } = state.credentials;
  const { apiKey = { grants: []}, isNew } = props;
  const grants = keyBy(allGrants, 'key');
  const grantsRadio = valueSelector(state, 'grantsRadio');
  const initialValues = formatValues(apiKey);
  const initialGrantsRadio =
    isNew || allGrants.length <= apiKey.grants.length ? 'all' : 'select';

  return {
    grants,
    showGrants: grantsRadio === 'select',
    initialValues: {
      grantsRadio: initialGrantsRadio,
      ...initialValues
    }
  };
};

export default connect(mapStateToProps, { fetchGrants })(ApiKeyReduxForm);
