import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import { getDraft, getPublished, update, deleteTemplate, publish, getTestData, setTestData } from 'src/actions/templates';
import { showAlert } from 'src/actions/globalAlert';
import { hasGrants } from 'src/helpers/conditions';
import { selectTemplateById, selectTemplateTestData } from 'src/selectors/templates';
import { selectSubaccountIdFromQuery, hasSubaccounts, selectSubaccountFromQuery } from 'src/selectors/subaccounts';

import EditPage from '../EditPage';

const FORM_NAME = 'templateEdit';

const mapStateToProps = (state, props) => {
  const template = selectTemplateById(state, props);
  const values = template.draft || template.published; // For templates with published but no draft, pull in published values
  const canModify = hasGrants('templates/modify')(state);

  return {
    loading: state.templates.getLoading,
    template,
    subaccountId: selectSubaccountIdFromQuery(state, props),
    hasSubaccounts: hasSubaccounts(state),
    canModify,

    // Redux Form
    formName: FORM_NAME,
    initialValues: {
      testData: selectTemplateTestData(state),
      ...values,
      subaccount: selectSubaccountFromQuery(state, props)
    }
  };
};

const formOptions = {
  form: FORM_NAME,
  enableReinitialize: true // required to update initial values from redux state
};

const mapDispatchToProps = {
  getDraft,
  getPublished,
  getTestData,
  setTestData,
  update,
  deleteTemplate,
  publish,
  showAlert
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(reduxForm(formOptions)(EditPage)));
