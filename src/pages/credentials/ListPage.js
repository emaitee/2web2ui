import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Page } from '@sparkpost/matchbox';

import { listApiKeys } from 'actions/credentials';

import ApiErrorBanner from 'components/apiErrorBanner/ApiErrorBanner';
import TableCollection from 'components/collection/TableCollection';
import Layout from 'components/layout/Layout';
import { getLoading } from 'selectors/credentials';
import PermissionsColumn from './components/PermissionsColumn';

const columns = ['Name', 'Key', 'Permissions'];

const primaryAction = {
  content: 'Create API Key',
  Component: Link,
  to: '/account/credentials/create'
};

const getRowData = (key) => [
  <Link to={`/account/credentials/details/${key.id}`}>{key.label}</Link>,
  <code>{key.short_key} ••••</code>,
  <PermissionsColumn grants={key.grants} />
];

export class ListPage extends Component {
  componentDidMount() {
    this.props.listApiKeys();
  }

  renderCollection() {
    const { keys } = this.props;

    return (
      <TableCollection
        columns={columns}
        getRowData={getRowData}
        pagination={true}
        rows={keys}
      />
    );
  }

  renderError() {
    const { error, listApiKeys } = this.props;

    return (
      <ApiErrorBanner
        errorDetails={error.message}
        message="Sorry, we seem to have had some trouble loading your API keys."
        reload={listApiKeys}
      />
    );
  }

  render() {
    const { error, loading } = this.props;

    return (
      <Layout.App loading={loading}>
        <Page primaryAction={primaryAction} title="API Keys" />
        {error ? this.renderError() : this.renderCollection()}
      </Layout.App>
    );
  }
}

const mapStateToProps = (state) => {
  const { error, keys } = state.credentials;
  return {
    error,
    keys,
    loading: getLoading(state)
  };
};

export default connect(mapStateToProps, { listApiKeys })(ListPage);
