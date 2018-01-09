/* eslint max-lines: ["warn", { "max": 215, "skipComments": true }] */
// @see discussion for custom lint rule, https://github.com/SparkPost/2web2ui/issues/230
import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import localforage from 'localforage';
import config from 'src/config';
import { getTestDataKey } from './helpers/templates';

export function listTemplates() {
  return sparkpostApiRequest({
    type: 'LIST_TEMPLATES',
    meta: {
      method: 'GET',
      url: '/templates'
    }
  });
}

export function getDraft(id) {
  return sparkpostApiRequest({
    type: 'GET_DRAFT_TEMPLATE',
    meta: {
      method: 'GET',
      url: `/templates/${id}`,
      params: {
        draft: true
      }
    }
  });
}

export function getDraftAndPreview(id) {
  return async(dispatch) => {
    const { content } = await dispatch(getDraft(id));
    const { payload = {}} = await dispatch(getTestData({ id, mode: 'draft' }));
    const substitution_data = payload.substitution_data || {};

    return dispatch(getPreview({ content, id, mode: 'draft', substitution_data }));
  };
}

// @todo Switch to the newer preview endpoint
// @see https://github.com/SparkPost/sparkpost-admin-api-documentation/blob/master/services/content_previewer_api.md#preview-inline-content-post
// @see https://github.com/SparkPost/sparkpost-api-documentation/blob/master/services/templates.md#preview-templatesidpreviewdraft
export function getPreview({ content, id, mode, substitution_data = {}}) {
  return sparkpostApiRequest({
    type: 'GET_TEMPLATE_PREVIEW',
    meta: {
      context: { id, mode },
      method: 'POST',
      url: '/utils/content-previewer',
      data: { content, substitution_data }
    }
  });
}

export function getPublished(id) {
  return sparkpostApiRequest({
    type: 'GET_PUBLISHED_TEMPLATE',
    meta: {
      method: 'GET',
      url: `/templates/${id}`,
      params: {
        draft: false
      }
    }
  });
}

export function getPublishedAndPreview(id) {
  return async(dispatch) => {
    const { content } = await dispatch(getPublished(id));
    const { payload = {}} = await dispatch(getTestData({ id, mode: 'published' }));
    const substitution_data = payload.substitution_data || {};

    return dispatch(getPreview({ content, id, mode: 'published', substitution_data }));
  };
}

export function create(data) {
  const { id, testData, ...formData } = data;

  return (dispatch) => {
    dispatch(setTestData({ id, mode: 'draft', data: testData }));

    return dispatch(sparkpostApiRequest({
      type: 'CREATE_TEMPLATE',
      meta: {
        method: 'POST',
        url: '/templates',
        data: { ...formData, id }
      }
    }));
  };
}

export function update(data, params = {}) {
  const { id, testData, ...formData } = data;

  return (dispatch) => {
    dispatch(setTestData({ id, mode: 'draft', data: testData }));

    return dispatch(sparkpostApiRequest({
      type: 'UPDATE_TEMPLATE',
      meta: {
        method: 'PUT',
        url: `/templates/${id}`,
        data: formData,
        params
      }
    }));
  };
}

export function publish(data) {
  return (dispatch) => {
    const { id, testData } = data;

    // Save draft first, then publish
    return dispatch(update(data)).then(() => {
      dispatch(setTestData({ id, mode: 'published', data: testData }));

      return dispatch(sparkpostApiRequest({
        type: 'PUBLISH_TEMPLATE',
        meta: {
          method: 'PUT',
          url: `/templates/${id}`,
          data: { published: true }
        }
      }));
    });
  };
}

export function deleteTemplate(id) {
  return sparkpostApiRequest({
    type: 'DELETE_TEMPLATE',
    meta: {
      method: 'DELETE',
      url: `/templates/${id}`
    }
  });
}

export function setTestData({ data, id, mode }) {
  return (dispatch, getState) => {
    const username = getState().currentUser.username;
    const testData = typeof data === 'object' ? JSON.stringify(data) : data;
    return localforage.setItem(getTestDataKey({ id, username, mode }), testData).then(() => dispatch({ type: 'SET_TEMPLATE_TEST_DATA' }));
  };
}

export function getTestData({ id, mode }) {
  return (dispatch, getState) => {
    const username = getState().currentUser.username;

    return localforage.getItem(getTestDataKey({ id, username, mode })).then((results) => {
      let testData;

      if (results) {
        testData = JSON.parse(results);

        // Reshapes test data if it does not conform with default JSON structure
        if (!['substitution_data', 'metadata', 'options'].every((key) => key in testData)) {
          testData = { ...config.templates.testData, substitution_data: testData };
        }
      }

      return dispatch({
        type: 'GET_TEMPLATE_TEST_DATA',
        payload: testData
      });
    });
  };
}

// @see https://github.com/SparkPost/sparkpost-api-documentation/blob/master/services/transmissions.md#create-a-transmission-post
export function sendPreview({ id, mode, emails, from }) {
  const recipients = emails.map((email) => ({
    address: { email }
  }));

  return async(dispatch) => {
    const { payload: testData = {}} = await dispatch(getTestData({ id, mode }));

    return dispatch(sparkpostApiRequest({
      type: 'SEND_PREVIEW_TRANSMISSION',
      meta: {
        method: 'POST',
        url: '/transmissions',
        data: {
          ...testData,
          content: {
            template_id: id,
            use_draft_template: mode === 'draft'
          },
          options: {
            ...testData.options,
            sandbox: /sparkpostbox.com$/i.test(from)
          },
          recipients
        }
      }
    }));
  };
}
