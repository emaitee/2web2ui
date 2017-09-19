import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Page, Panel } from '@sparkpost/matchbox';

import Layout from 'components/layout/Layout';
import ApiKeyForm from './components/ApiKeyForm';

const breadcrumbAction = {
  content: 'API Keys',
  Component: Link,
  to: '/account/credentials'
};

export class CreatePage extends Component {
  onSubmit = (values) => {
    console.log('SUBMIT', values); // eslint-disable-line
    // this.props.createApiKey(values);
  };

  render() {
    return (
      <Layout.App loading={this.props.loading}>
        <Page title="Create API Key" breadcrumbAction={breadcrumbAction} />
        <Panel>
          <Panel.Section>
            <ApiKeyForm isNew onSubmit={this.onSubmit} />
          </Panel.Section>
        </Panel>
      </Layout.App>
    );
  }
}

const mapStateToProps = (state, props) => ({
  loading: state.credentials.loadingGrants || state.subaccounts.listLoading
});

export default connect(mapStateToProps)(CreatePage);
