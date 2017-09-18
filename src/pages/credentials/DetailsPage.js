import { find } from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Page, Panel } from '@sparkpost/matchbox';

import { fetchApiKeys } from 'actions/credentials';
import Layout from 'components/layout/Layout';
import ApiKeyForm from './components/ApiKeyForm';

const breadcrumbAction = {
  content: 'API Keys',
  Component: Link,
  to: '/account/credentials'
};

export class CredentialsDetailsPage extends Component {
  constructor(props) {
    super(props);

    this.secondaryActions = [{ content: 'Delete', onClick: this.onDelete }];
  }

  componentDidMount() {
    this.props.fetchApiKeys();
  }

  onDelete = () => {
    console.log('DELETE', this.props.apiKey.id); // eslint-disable-line
    // this.props.deleteApiKey();
  };

  onSubmit = (values) => {
    console.log('SUBMIT', this.props.apiKey.id, values); // eslint-disable-line
    // this.props.updateApiKey(values);
  };

  render() {
    const { apiKey, loading } = this.props;

    return (
      <Layout.App loading={loading}>
        <Page
          title={apiKey.label}
          breadcrumbAction={breadcrumbAction}
          secondaryActions={this.secondaryActions}
        />
        <Panel>
          <Panel.Section>
            <ApiKeyForm apiKey={apiKey} onSubmit={this.onSubmit} />
          </Panel.Section>
        </Panel>
      </Layout.App>
    );
  }
}

const mapStateToProps = (state, props) => {
  const {
    error,
    grants,
    keys,
    loadingGrants,
    loadingKeys
  } = state.credentials;

  // TODO: perfect place for a selector.
  const apiKey = find(keys, { id: props.match.params.id });

  return {
    apiKey,
    keys,
    error,
    grants,
    loading: loadingGrants || loadingKeys
  };
};

export default withRouter(
  connect(mapStateToProps, { fetchApiKeys })(CredentialsDetailsPage)
);
