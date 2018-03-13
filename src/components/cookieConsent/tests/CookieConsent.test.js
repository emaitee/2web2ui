import React from 'react';
import { shallow } from 'enzyme';
import { CookieConsent, ConsentBar } from '../CookieConsent';

describe('Component: CookieConsent', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      consentGiven: false,
      giveConsent: jest.fn()
    };

    wrapper = shallow(<CookieConsent {...props} />);
  });

  describe('ConsentBar', () => {
    it('should render correctly', () => {
      const props = { onDismiss: jest.fn() };
      expect(shallow(<ConsentBar {...props} />)).toMatchSnapshot();
    });
  });

  it('should render the banner without consent', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render the banner with consent', () => {
    wrapper.setProps({ consentGiven: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should give consent on dismissal', () => {
    wrapper.instance().storeConsent();
    expect(props.giveConsent).toHaveBeenCalledTimes(1);
  });
});
