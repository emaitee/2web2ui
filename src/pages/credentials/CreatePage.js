import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
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

export class CreatePage extends React.Component {
  onSubmit = (values) => {
    const { createApiKey, history } = this.props;

    return createApiKey(values).then((res) => {
      history.push('/account/credentials');
    });
  };

  render() {
    return (
      <Layout.App loading={this.props.loading}>
        <Page title="Create API Key" breadcrumbAction={breadcrumbAction} />
        <Panel>
          <Panel.Section>
            <ApiKeyForm onSubmit={this.onSubmit} />
          </Panel.Section>
        </Panel>
      </Layout.App>
    );
  }
}

const mapStateToProps = (state, props) => ({
  loading: getLoading(state)
});

export default withRouter(
  connect(mapStateToProps, { createApiKey })(CreatePage)
);
