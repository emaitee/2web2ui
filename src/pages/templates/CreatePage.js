import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import _ from 'lodash';

// Actions
import { create, getDraft } from 'src/actions/templates';
import { showAlert } from 'src/actions/globalAlert';

// Selectors
import { selectClonedTemplate, selectDefaultTestData } from 'src/selectors/templates';

// Components
import Form from './components/Form';
import Editor from './components/Editor'; // async
import { Page, Grid } from '@sparkpost/matchbox';
import { Loading } from 'src/components';

const FORM_NAME = 'templateCreate';

export class CreatePage extends Component {
  componentDidMount() {
    if (this.props.cloneId) {
      const { getDraft } = this.props;
      return getDraft(this.props.cloneId);
    }
  }

  handleCreate(values) {
    const { create, showAlert, id, history } = this.props;
    return create(values)
      .then(() => history.push(`/templates/edit/${id}`))
      .catch((err) => {
        const details = _.get(err, 'response.data.errors[0].description') || err.message;
        return showAlert({ type: 'error', message: 'Could not create template', details: details });
      });
  }

  render() {
    const { cloneId, handleSubmit, submitting, loading } = this.props;

    if (loading) {
      return <Loading />;
    }

    const primaryAction = {
      content: 'Save Template',
      onClick: handleSubmit((values) => this.handleCreate(values)),
      disabled: submitting
    };

    const backAction = {
      content: 'Templates',
      Component: Link,
      to: '/templates'
    };

    return (
      <Page
        primaryAction={primaryAction}
        breadcrumbAction={backAction}
        title={ cloneId ? 'Duplicate Template' : 'New Template' }>

        <Grid>
          <Grid.Column xs={12} lg={4}>
            <Form newTemplate name={FORM_NAME} />
          </Grid.Column>
          <Grid.Column xs={12} lg={8}>
            <Editor name={FORM_NAME} />
          </Grid.Column>
        </Grid>
      </Page>
    );
  }
}

const selector = formValueSelector(FORM_NAME);
const mapStateToProps = (state, props) => ({
  id: selector(state, 'id'),
  loading: state.templates.getLoading,
  cloneId: props.match.params.id, //ID of the template it's cloning from
  initialValues: {
    testData: selectDefaultTestData(),
    ...selectClonedTemplate(state, props)
  }
});

const formOptions = {
  form: FORM_NAME,
  enableReinitialize: true // required to update initial values from redux state
};

export default withRouter(connect(mapStateToProps, { create, getDraft, showAlert })(reduxForm(formOptions)(CreatePage)));
