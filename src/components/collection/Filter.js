import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';

import { Panel, Grid, Icon } from '@sparkpost/matchbox';
import { TextFieldWrapper, FilterDropdown } from 'src/components';

const FORMNAME = 'apiKeysFilters';
const subaccountOptions = [
  { content: 'Assigned to Master', name: 'master' },
  { content: 'Assigned to Subaccount', name: 'subaccount' }
];

const Filters = () => (
  <Panel sectioned>
    <Grid>
      <Grid.Column xs={8}>
        <Field
          name='search'
          placeholder='Search by name, user, key, or subaccount ID'
          prefix={<Icon name='Search'/>}
          component={TextFieldWrapper}
        />
      </Grid.Column>
      <Grid.Column>
        <FilterDropdown
          formName={FORMNAME}
          namespace='subaccount'
          options={subaccountOptions}
          displayValue='Subaccount' />
      </Grid.Column>
    </Grid>
  </Panel>
);

/**
 * Rows config example:

 [
   {
     filters: [
       {
         dropdown: true,
         title: 'Subaccount',
         matchPath: 'subaccount',
         options: [
           { label: 'Assigned to Master', matchValue: 'master' }
         ]
       }
     ]
   }
 ]
 */

function parseFilterConfig(rows) {
  return rows.map((row, i) => (
    <Panel sectioned key={`filter-row-${i}`}>
      <Grid>
        {parseFiltersRow(row)}
      </Grid>
    </Panel>
  ))
}

function parseFiltersRow({ filters }) {
  return filters.map((filter) => (
    <Grid.Column xs={8} key={`filter-column-${filter.name}`}>
      {parseFilter(filter)}
    </Grid.Column>
  ))
}

function parseFilter({ title, options, dropdown }) {
  if (dropdown) {
    return (
      <FilterDropdown
        formName={COMPUTED_FORMNAME}
        displayValue={title}
        namespace={COMPUTED_NAMESPACE}
        options={}
    )
  }
}

const mapStateToProps = (state) => ({
  initialValues: {}
});

const mapDispatchtoProps = { };
const formOptions = { form: FORMNAME };
export default connect(mapStateToProps, mapDispatchtoProps)(reduxForm(formOptions)(Filters));
