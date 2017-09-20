import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Page, Panel } from '@sparkpost/matchbox';

import { deleteApiKey, listApiKeys, updateApiKey } from 'actions/credentials';
import Layout from 'components/layout/Layout';
import { getApiKey, getLoading } from 'selectors/credentials';
import ApiKeyForm from './components/ApiKeyForm';

const breadcrumbAction = {
  content: 'API Keys',
  Component: Link,
  to: '/account/credentials'
};

export class CredentialsDetailsPage extends Component {
  static defaultProps = {
    apiKey: {}
  };

  constructor(props) {
    super(props);

    this.secondaryActions = [
      { content: 'Delete', onClick: this.props.deleteApiKey }
    ];
  }

  componentDidMount() {
    this.props.listApiKeys();
  }

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
            <ApiKeyForm apiKey={apiKey} onSubmit={this.props.updateApiKey} />
          </Panel.Section>
        </Panel>
      </Layout.App>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { error, grants, keys } = state.credentials;

  return {
    apiKey: getApiKey(state, props),
    keys,
    error,
    grants,
    loading: getLoading(state)
  };
};

const mapDispatchToProps = (dispatch, props) => {
  const { id } = props.match.params;

  return {
    deleteApiKey: () => dispatch(deleteApiKey(id)),
    listApiKeys: () => dispatch(listApiKeys()),
    updateApiKey: (values) => dispatch(updateApiKey(id, values))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CredentialsDetailsPage)
);
