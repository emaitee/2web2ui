import { shallow } from 'enzyme';
import React from 'react';

import PublishedPage from '../PublishedPage';

describe('Template PublishedPage', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      match: {
        params: { id: 'id' }
      },
      getPublished: jest.fn(() => Promise.resolve()),
      getTestData: jest.fn(),
      setTestData: jest.fn(),
      formName: 'templatePublished',
      handleSubmit: jest.fn(),
      canModify: true
    };
  });

  it('should render correctly', () => {
    wrapper = shallow(<PublishedPage {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render read-only correctly', () => {
    wrapper = shallow(<PublishedPage {...props} canModify={false} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should load template content', () => {
    wrapper = shallow(<PublishedPage {...props} />);
    expect(props.getTestData).toHaveBeenCalledWith({ id: 'id', mode: 'published' });
    expect(props.getPublished).toHaveBeenCalledWith('id', props.subaccountId);
  });

  it('should get subaccount template', () => {
    wrapper = shallow(<PublishedPage {...props} subaccountId={101} />);
    expect(props.getPublished).toHaveBeenCalledWith('id', 101);
  });

  it('should render loading', () => {
    wrapper = shallow(<PublishedPage {...props} loading />);
    expect(wrapper.find('Loading')).toHaveLength(1);
  });
});
