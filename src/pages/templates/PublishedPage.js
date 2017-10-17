import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

// Actions
import { getPublished } from '../../actions/templates';

// Selectors
import { getTemplateById } from 'src/selectors/templates';

// Components
import { Layout } from 'src/components';
import Form from './components/Form';
import Editor from './components/Editor';
import { Page, Grid } from '@sparkpost/matchbox';

const FORM_NAME = 'templatePublished';

class PublishedPage extends Component {
  state = {
    shouldRedirectToPublished: false
  };

  componentWillMount() {
    const { match, getPublished } = this.props;
    getPublished(match.params.id);
  }

  renderPageHeader() {
    const { match } = this.props;

    const secondaryActions = [
      {
        content: 'View Draft',
        Component: Link,
        to: `/templates/edit/${match.params.id}`
      },
      {
        content: 'Preview & Send',
        disabled: true
      }
    ];

    const backAction = {
      content: 'Templates',
      Component: Link,
      to: '/templates'
    };

    return (
      <Page
        secondaryActions={secondaryActions}
        breadcrumbAction={backAction}
        title={`${match.params.id} (Published)`}
      />
    );
  }

  render() {
    const { loading } = this.props;

    return (
      <Layout.App loading={loading}>
        { this.renderPageHeader() }
        <Grid>
          <Grid.Column xs={12} lg={4}>
            <Form name={FORM_NAME} published />
          </Grid.Column>
          <Grid.Column xs={12} lg={8}>
            <Editor name={FORM_NAME} published />
          </Grid.Column>
        </Grid>
      </Layout.App>
    );
  }
}

const mapStateToProps = (state, props) => ({
  loading: state.templates.getLoading,
  initialValues: getTemplateById(state, props).published
});

const formOptions = {
  form: FORM_NAME,
  enableReinitialize: true // required to update initial values from redux state
};

export default connect(mapStateToProps, { getPublished })(reduxForm(formOptions)(PublishedPage));
