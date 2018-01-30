import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

// Actions
import { listAllWebhooks } from 'src/actions/webhooks';
import { setSubaccountQuery } from 'src/helpers/subaccounts';
import { hasSubaccounts } from 'src/selectors/subaccounts';

// Components
import { Loading, TableCollection, SubaccountTag, ApiErrorBanner } from 'src/components';
import { Page } from '@sparkpost/matchbox';

<<<<<<< HEAD
const columns = [{ label: 'Name', sortKey: 'name' }, 'ID', 'Target'];
export const getRowData = ({ id, name, target }) => {
  const nameLink = <Link to={`/webhooks/details/${id}`}>{name}</Link>;
  return [nameLink, id, target];
};
=======
>>>>>>> c5153a94... FAD-6110 started fixing subaccount support in api keys, webhooks
const filterBoxConfig = {
  show: true,
  itemToStringKeys: ['name', 'target']
};


export class WebhooksList extends Component {

  componentDidMount() {
    this.props.listAllWebhooks();
  }

  getColumns = () => {
    const { hasSubaccounts } = this.props;
    const columns = ['Name', 'Target'];

    if (hasSubaccounts) {
      columns.push('Events For');
    }

    return columns;
  };

  getRowData = ({ id, name, target, subaccount_id }) => {
    const { hasSubaccounts } = this.props;
    const nameLink = <Link to={`/webhooks/details/${id}${setSubaccountQuery(subaccount_id)}`}>{name}</Link>;
    const row = [nameLink, target];

    if (hasSubaccounts) {
      let subaccountTag = null;

      if (subaccount_id) {
        subaccountTag = <SubaccountTag id={subaccount_id} />;
      } else if (subaccount_id !== 0) {
        subaccountTag = <SubaccountTag receiveAll />;
      }
      row.push(subaccountTag);
    }

    return row;
  };

  renderError() {
    const { error, listAllWebhooks } = this.props;
    return (
      <ApiErrorBanner
        message={'Sorry, we seem to have had some trouble loading your webhooks.'}
        errorDetails={error.message}
        reload={listAllWebhooks}
      />
    );
  }

  renderCollection() {
    const { webhooks } = this.props;
    return (
      <TableCollection
        columns={this.getColumns()}
        rows={webhooks}
        getRowData={this.getRowData}
        pagination={true}
        filterBox={filterBoxConfig}
        defaultSortColumn='name'
      />
    );
  }

  render() {
    const { loading, error, webhooks } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <Page
        primaryAction={{ content: 'Create Webhook', Component: Link, to: '/webhooks/create' }}
        title='Webhooks'
        empty={{
          show: webhooks.length === 0,
          image: 'Setup',
          title: 'Create a Webhook',
          content: <p>Push message events directly to your own endpoints</p>
        }}>
        { error ? this.renderError() : this.renderCollection() }
      </Page>
    );
  }
}

function mapStateToProps({ webhooks, ...state }) {
  return {
    hasSubaccounts: hasSubaccounts(state),
    webhooks: webhooks.list,
    loading: webhooks.listLoading,
    error: webhooks.listError
  };
}

export default withRouter(connect(mapStateToProps, { listAllWebhooks })(WebhooksList));
