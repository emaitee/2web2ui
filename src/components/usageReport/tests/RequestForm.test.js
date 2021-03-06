import React from 'react';
import { shallow } from 'enzyme';
import { RequestForm } from '../RequestForm';

describe('RequestForm Component', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      onSubmit: jest.fn(),
      handleSubmit: jest.fn(),
      onCancel: jest.fn(),
      invalid: true,
      pristine: true,
      submitting: false
    };
    wrapper = shallow(<RequestForm {...props} />);
  });

  it('renders form', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('submit is enabled when form is valid', () => {
    wrapper.setProps({ invalid: false, pristine: false });
    expect(wrapper).toMatchSnapshot();
  });

  it('submit is disabled when submitting', () => {
    wrapper.setProps({ submitting: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('submits form correctly', () => {
    wrapper.find('Button').at(0).simulate('click');
    expect(props.handleSubmit).toHaveBeenCalled();
  });

  it('hides form on clicking cancel button', () => {
    wrapper.find('Button').at(1).simulate('click');
    expect(props.onCancel).toHaveBeenCalled();
  });

});
