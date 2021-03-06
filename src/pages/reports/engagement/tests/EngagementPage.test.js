import React from 'react';
import { shallow } from 'enzyme';
import { EngagementPage } from '../EngagementPage';

describe('Engagement Report Page', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      aggregateMetrics: {
        data: {
          count_accepted: 1,
          count_targeted: 2,
          count_unique_clicked_approx: 3,
          count_unique_confirmed_opened_approx: 4
        },
        loading: false
      },
      linkMetrics: {
        data: [
          { count_clicked: 1776, count_raw_clicked_approx: 1657, link_name: 'Raw URL' }
        ],
        loading: false
      },
      refreshEngagementReport: jest.fn()
    };
    wrapper = shallow(<EngagementPage {...props} />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should refresh when report options reference changes', () => {
    const newReportOptions = {};
    expect(props.refreshEngagementReport).not.toHaveBeenCalled();
    wrapper.setProps({ reportOptions: newReportOptions });
    expect(props.refreshEngagementReport).toHaveBeenCalledWith(newReportOptions);
  });

});

