import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Page, Panel } from '@sparkpost/matchbox';

import { createApiKey } from 'actions/credentials';
import Layout from 'components/layout/Layout';
import { getLoading } from 'selectors/credentials';
import ApiKeyForm from './components/ApiKeyForm';

const breadcrumbAction = {
  content: 'API Keys',
  Component: Link,
  to: '/account/credentials'
};

const CreatePage = ({ createApiKey, loading }) => (
  <Layout.App loading={loading}>
    <Page title="Create API Key" breadcrumbAction={breadcrumbAction} />
    <Panel>
      <Panel.Section>
        <ApiKeyForm onSubmit={createApiKey} />
      </Panel.Section>
    </Panel>
  </Layout.App>
);

const mapStateToProps = (state, props) => ({
  loading: getLoading(state)
});

export default connect(mapStateToProps, { createApiKey })(CreatePage);
