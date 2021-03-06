import React from 'react';
import { AddIps } from '../AddIps';
import { shallow } from 'enzyme';
import { SubmissionError } from 'redux-form';
import { isAws } from 'src/helpers/conditions/account';

jest.mock('src/helpers/conditions/account');

describe('AddIps', () => {
  let wrapper;
  let instance;
  let plan;

  beforeEach(() => {
    plan = {};
    const props = {
      currentPlan: plan,
      sendingIps: [],
      handleSubmit: jest.fn(),
      account: {}
    };

    isAws.mockImplementation(() => false);

    wrapper = shallow(<AddIps {...props} />);
    instance = wrapper.instance();
  });

  it('renders correctly with default props', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly when user reaches max ip limit', () => {
    wrapper.setProps({ sendingIps: new Array(4) });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders free ip elements when included in plan', () => {
    plan.includesIp = true;
    wrapper.setProps({ plan });
    expect(wrapper).toMatchSnapshot();
  });

  describe('onSubmit', () => {
    let additionalProps;
    beforeEach(() => {
      instance.getOrCreateIpPool = jest.fn(async() => Promise.resolve('pool_name'));

      additionalProps = {
        showAlert: jest.fn(),
        onClose: jest.fn(),
        addDedicatedIps: jest.fn(() => Promise.resolve())
      };
      wrapper.setProps(additionalProps);
    });

    it('calls addDedicatedIps with correct args', async() => {
      await instance.onSubmit({ ipPool: 'pool name', quantity: 2 });
      expect(instance.props.addDedicatedIps).toHaveBeenCalledWith({
        ip_pool: 'pool_name',
        isAwsAccount: false,
        quantity: 2
      });
      expect(additionalProps.showAlert).toHaveBeenCalledTimes(1);
      expect(additionalProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('calls addDedicatedIps with correct args for aws account', async() => {
      isAws.mockImplementation(() => true);
      await instance.onSubmit({ ipPool: 'pool name', quantity: 1 });
      expect(instance.props.addDedicatedIps).toHaveBeenCalledWith({
        ip_pool: 'pool_name',
        isAwsAccount: true,
        quantity: 1
      });
    });

    it('throws on error', async() => {
      additionalProps.addDedicatedIps.mockReturnValue(Promise.reject());
      await expect(instance.onSubmit({ ipPool: 'pool name', quantity: 1 })).rejects.toThrowError(SubmissionError);
      expect(additionalProps.showAlert).toHaveBeenCalledTimes(0);
      expect(additionalProps.onClose).toHaveBeenCalledTimes(0);
    });
  });

});
