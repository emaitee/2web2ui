import { shallow } from 'enzyme';
import React from 'react';
import { ListPage } from '../ListPage';

const hideNewApiKey = jest.fn();
const listApiKeys = jest.fn(() => []);

describe('Api Keys List Page', () => {
  const props = {
    loading: false,
    error: null,
    hideNewApiKey,
    listApiKeys,
    hasSubaccounts: false,
    count: 30,
    keys: [
      {
        id: '123id',
        label: 'Test Key 1',
        short_key: 'ab01',
        grants: ['metrics/view'],
        subaccount_id: 101
      },
      {
        label: 'Test Key 2',
        short_key: 'fe98',
        grants: ['smtp/inject']
      }
    ]
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<ListPage {...props} />);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders errors when present', () => {
    wrapper.setProps({ error: { message: 'Uh oh! It broke. ' }});
    expect(wrapper).toMatchSnapshot();
  });

  it('should show loading component during load', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should show api key banner on successful create', () => {
    wrapper.setProps({ newKey: 'my-shiny-new-key' });
    expect(wrapper).toMatchSnapshot();
  });

  it('should list keys on reload', () => {
    const page = new ListPage();
    page.props = { listApiKeys: jest.fn() };
    page.onReloadApiBanner();
    expect(page.props.listApiKeys).toHaveBeenCalledTimes(1);
  });

  it('should hide api key on component unmount', () => {
    expect(hideNewApiKey).not.toHaveBeenCalled();
    wrapper.unmount();
    expect(hideNewApiKey).toHaveBeenCalled();
  });

  it('should render correctly with subaccounts', () => {
    wrapper.setProps({ hasSubaccounts: true });
    expect(wrapper.find('TableCollection').props().columns).toMatchSnapshot();
    const row = wrapper.instance().getRowData(props.keys[0]);
    expect(row).toMatchSnapshot();
  });
});
