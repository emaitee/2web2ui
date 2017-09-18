import React from 'react';
import { chunk, map, size } from 'lodash';
import { Field } from 'redux-form';
import { Grid } from '@sparkpost/matchbox';

import { CheckboxWrapper } from 'components/reduxFormWrappers';

const GrantsCheckboxes = ({ grants }) => {
  const grantFields = map(grants, (grant) => (
    // TODO wrap me in a tooltip
    <Field
      key={grant.key}
      name={`grants[${grant.key}]`}
      label={grant.label}
      component={CheckboxWrapper}
      type="checkbox"
      normalize={(value) => (value ? 'true' : '')} // TODO is this necessary? otherwise we get proptype warnings
    />
  ));

  const grantFieldChunks = chunk(grantFields, Math.ceil(size(grants) / 3));

  const grantCols = map(grantFieldChunks, (grantFields, i) => (
    <Grid.Column xs={12} md={4} key={i}>
      {grantFields}
    </Grid.Column>
  ));

  return <Grid>{grantCols}</Grid>;
};

export default GrantsCheckboxes;
