import copy from 'copy-to-clipboard';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Banner, Page } from '@sparkpost/matchbox';

import { hideNewApiKey, listApiKeys } from 'actions/credentials';

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

  onClickBanner = () => {
    copy(this.props.newKey);
  };

  renderBanner() {
    const { hideNewApiKey, newKey } = this.props;

    const action = { content: 'Copy', onClick: this.onClickBanner };

    return (
      <Banner
        action={action}
        title="New API Key"
        status="success"
        onDismiss={hideNewApiKey}
      >
        <p>
          Make sure to copy your API key now. You won't be able to see it again!
        </p>
        <strong>{newKey}</strong>
      </Banner>
    );
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
    const { error, loading, newKey } = this.props;

    return (
      <Layout.App loading={loading}>
        <Page primaryAction={primaryAction} title="API Keys" />
        {newKey && this.renderBanner()}
        {error ? this.renderError() : this.renderCollection()}
      </Layout.App>
    );
  }
}

const mapStateToProps = (state) => {
  const { error, keys, newKey } = state.credentials;
  return {
    error,
    keys,
    loading: getLoading(state),
    newKey
  };
};

export default connect(mapStateToProps, { hideNewApiKey, listApiKeys })(
  ListPage
);
