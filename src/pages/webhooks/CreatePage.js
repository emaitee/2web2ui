import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import _ from 'lodash';

// Actions
import { createWebhook, getEventDocs } from '../../actions/webhooks';

// Components
import { Layout } from 'src/components';
import { Page, Panel } from '@sparkpost/matchbox';
import WebhookForm from './components/WebhookForm';

class WebhooksCreate extends Component {
  state = {}

  componentDidMount() {
    if (!this.props.eventDocs) {
      this.props.getEventDocs();
    }
  }

  /*
    Makes a webhook object from form values and calls the createWebhook action
    with it. Invoked in the form's onSubmit func
  */
  createWebhook(values, eventsTree) {
    const { name, target, eventsRadio, auth } = values;

    const webhook = {
      name: name,
      target: target
    };

    let events;

    if (eventsRadio === 'select') {
      const checkedEvents = _.concat(values.message_event, values.track_event, values.gen_event, values.unsubscribe_event, values.relay_event);
      events = _.filter(checkedEvents, (event) => (event)); // filter for truthy
    } else {
      // all events
      events = _.flatten(_.map(eventsTree, ({ events }) => _.map(events, ({ key }) => (key))));
    }

    webhook.events = events;

    // builds the webhooks auth details from the form values
    switch (auth) {
      case 'basic':
        webhook.auth_type = 'basic';
        webhook.auth_credentials = {
          username: values.basicUser,
          password: values.basicPass
        };
        break;
      case 'oauth2':
        webhook.auth_type = 'oauth2';
        webhook.auth_request_details = {
          url: values.tokenURL,
          body: {
            client_id: values.clientId,
            client_secret: values.clientSecret
          }
        };
        break;
      default: // none
        break;
    }

    return this.props.createWebhook(webhook).then(() => this.setState({ redirectTo: '/webhooks' }));
  }

  /*
    Builds a tree of event data, based on the eventDocs, for the form to create
    the checkbox groups with.
  */
  buildEventsData(eventGroups) {
    return _.map(eventGroups, ({ display_name, description, events }, key) => ({
      key: key,
      label: display_name,
      description: description,
      events: _.map(events, ({ display_name, description }, eventKey) => ({
        key: eventKey,
        label: display_name,
        description: description
      }))
    }));
  }

  render() {
    const { redirectTo } = this.state;

    if (redirectTo) {
      return <Redirect to={redirectTo} />;
    }

    const { eventsLoading } = this.props;  // Form doesn't load until we have events
    const { eventDocs } = this.props;
    const eventsTree = this.buildEventsData(eventDocs);

    return (
      <Layout.App loading={eventsLoading}>
        <Page
          title='Create Webhook'
          breadcrumbAction={{ content: 'Webhooks', Component: Link, to: '/webhooks' }}
        />
        <Panel>
          <Panel.Section>
            <WebhookForm eventsTree={eventsTree} newWebhook={true} onSubmit={(values) => this.createWebhook(values, eventsTree)}/>
          </Panel.Section>
        </Panel>
      </Layout.App>
    );
  }
}

const mapStateToProps = ({ webhooks }) => ({
  eventsLoading: webhooks.docsLoading,
  eventDocs: webhooks.docs
});

export default connect(mapStateToProps, { createWebhook, getEventDocs })(WebhooksCreate);
