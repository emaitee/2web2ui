import { shallow } from 'enzyme';
import React from 'react';
import { OnboardingPlanPage as ChoosePlan } from '../ChoosePlan';

describe('ChoosePlan page tests', () => {
  let wrapper;
  let instance;

  const props = {
    hasError: false,
    getPlans: jest.fn(),
    getBillingCountries: jest.fn(),
    billingCreate: jest.fn(() => Promise.resolve()),
    handleSubmit: jest.fn(),
    showAlert: jest.fn(),
    history: {
      push: jest.fn()
    },
    loading: false,
    billing: { countries: []},
    plans: [],
    submitting: false,
    updateSubscription: jest.fn(() => Promise.resolve())
  };

  beforeEach(() => {
    wrapper = shallow(<ChoosePlan {...props}/>);
    instance = wrapper.instance();
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
    expect(instance.props.history.push).not.toHaveBeenCalled();
  });

  it('should render loading component', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should redirect to next step when api calls fail', () => {
    wrapper.setProps({ hasError: true });
    expect(instance.props.history.push).toHaveBeenCalledWith('/onboarding/sending-domain');
  });

  it('should show free bullets when isFree is selected', () => {
    wrapper.setProps({ selectedPlan: { isFree: true }});
    expect(wrapper).toMatchSnapshot();
  });

  it('should disable submit and plan picker when submitting', () => {
    wrapper.setProps({ submitting: true });
    expect(wrapper).toMatchSnapshot();
  });

  describe('onSubmit tests', () => {
    it('should go to next page if plan is free, no-op', async() => {
      await instance.onSubmit({ planpicker: { isFree: true }});
      expect(instance.props.history.push).toHaveBeenCalledWith('/onboarding/sending-domain');
      expect(instance.props.billingCreate).not.toHaveBeenCalled();
    });

    it('should create billing record on submission', async() => {
      const values = { planpicker: { isFree: false }, key: 'value' };
      await instance.onSubmit(values);
      expect(instance.props.billingCreate).toHaveBeenCalledWith(values);
      expect(instance.props.updateSubscription).not.toHaveBeenCalled();
      expect(instance.props.history.push).toHaveBeenCalledWith('/onboarding/sending-domain');
      expect(instance.props.showAlert).toHaveBeenCalledWith({ type: 'success', message: 'Added your plan' });
    });

  });
});
