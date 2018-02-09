import React from 'react';
import { AcceptedPage } from '../AcceptedPage';
import Filters from '../../components/Filters';
import { shallow } from 'enzyme';
import * as reportHelpers from 'src/helpers/reports';

jest.mock('src/helpers/reports');

Date.now = jest.fn(() => 1487076708000);

describe('AcceptedPage: ', () => {

  const props = {
    loading: false,
    aggregates: { count_accepted: 1 },
    refreshAcceptedMetrics: jest.fn(() => Promise.resolve()),
    initTypeaheadCache: jest.fn(() => Promise.resolve()),
    addFilters: jest.fn(),
    showAlert: jest.fn(),
    location: {
      search: {}
    },
    history: {
      replace: jest.fn()
    }
  };

  let wrapper;
  let spyFilterListFromSearch;
  let spyParseSearch;
  let spyGetShare;

  beforeEach(() => {
    spyFilterListFromSearch = reportHelpers.getFilterSearchOptions = jest.fn(() => []);
    spyParseSearch = reportHelpers.parseSearch = jest.fn(() => ({ options: {}}));
    spyGetShare = reportHelpers.getFilterSearchOptions = jest.fn(() => ({ to: 'to', from: 'from' }));
    wrapper = shallow(<AcceptedPage {...props} />);
  });

  afterEach(() => {
    spyFilterListFromSearch.mockRestore();
    spyParseSearch.mockRestore();
    spyGetShare.mockRestore();
  });

  it('should render', () => {
    const parseSpy = jest.spyOn(wrapper.instance(), 'parseSearch');
    wrapper.instance().componentDidMount();
    expect(props.refreshAcceptedMetrics).toHaveBeenCalled();
    expect(parseSpy).toHaveBeenCalled();
    expect(props.initTypeaheadCache).toHaveBeenCalled();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with no accepted results', () => {
    wrapper.setProps({ aggregates: null });
    expect(wrapper.find('Empty')).toMatchSnapshot();
  });

  it('should render loading correctly over top level metrics', () => {
    wrapper.setProps({ chartLoading: true });
    expect(wrapper.find('PanelLoading')).toHaveLength(1);
  });

  it('should handle modal', () => {
    wrapper.find(Filters).simulate('share');
    expect(wrapper).toHaveState('modal', true);
    expect(wrapper.find('ShareModal')).toMatchSnapshot();
  });

  it('should show an alert when refresh fails', async() => {
    wrapper.setProps({ refreshAcceptedMetrics: jest.fn(() => Promise.reject(new Error('no way'))) });
    await wrapper.instance().handleRefresh();
    expect(props.showAlert).toHaveBeenCalledWith({ type: 'error', message: 'Unable to refresh report.', details: 'no way' });
  });

  it('should call addFilters when there are filters', () => {
    reportHelpers.parseSearch = jest.fn(() => ({ options: {}, filters: ['1', '2', '3']}));
    wrapper.instance().parseSearch();
    expect(props.addFilters).toHaveBeenCalledWith(['1', '2', '3']);
  });
});
