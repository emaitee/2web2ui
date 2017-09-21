import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Page, Panel } from '@sparkpost/matchbox';

import { deleteApiKey, listApiKeys, updateApiKey } from 'actions/credentials';
import Layout from 'components/layout/Layout';
import DeleteModal from 'components/deleteModal/DeleteModal';
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

  state = {
    showDeleteModal: false
  };

  constructor(props) {
    super(props);
    this.secondaryActions = [
      { content: 'Delete', onClick: this.onToggleDelete }
    ];
  }

  componentDidMount() {
    this.props.listApiKeys();
  }

  onDelete = () => {
    const { deleteApiKey, history } = this.props;

    deleteApiKey().then(() => {
      // TODO: showAlert({ type: 'success', message: 'API Key deleted'})
      history.push('/account/credentials');
    });
  };

  onToggleDelete = () => {
    this.setState({ showDeleteModal: !this.state.showDeleteModal });
  };

  onSubmit = (values) => {
    const { updateApiKey, history } = this.props;

    updateApiKey(values).then((res) => {
      // TODO: showAlert({ type: 'success', message: 'API Key updated'})
      history.push('/account/credentials');
    });
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
        <DeleteModal
          open={this.state.showDeleteModal}
          title="Delete API Key"
          text="Are you sure you want to delete this API Key?"
          handleToggle={this.onToggleDelete}
          handleDelete={this.onDelete}
        />
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
