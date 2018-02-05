import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import { getPublished, getTestData } from 'src/actions/templates';
import { selectTemplateById, selectTemplateTestData } from 'src/selectors/templates';
import { selectSubaccountIdFromQuery, selectSubaccountFromQuery } from 'src/selectors/subaccounts';
import { hasSubaccounts } from 'src/selectors/subaccounts';

import PublishedPage from '../PublishedPage';

const FORM_NAME = 'templatePublished';

const mapStateToProps = (state, props) => ({
  loading: state.templates.getLoading,
  subaccountId: selectSubaccountIdFromQuery(state, props),
  hasSubaccounts: hasSubaccounts(state),
  formName: FORM_NAME,
  initialValues: {
    testData: selectTemplateTestData(state),
    ...selectTemplateById(state, props).published,
    subaccount: selectSubaccountFromQuery(state, props)
  }
});

const formOptions = {
  form: FORM_NAME,
  enableReinitialize: true // required to update initial values from redux state
};

export default withRouter(connect(mapStateToProps, { getPublished, getTestData })(reduxForm(formOptions)(PublishedPage)));
