import * as delayReport from '../delayReport';
import * as metricsActions from 'src/actions/metrics';
import * as metricsHelpers from 'src/helpers/metrics';

import moment from 'moment';

jest.mock('../helpers/sparkpostApiRequest', () => jest.fn((a) => a));
jest.mock('src/helpers/bounce');
jest.mock('src/helpers/metrics');
jest.mock('src/actions/metrics');
jest.mock('src/actions/reportFilters');

describe('Action Creator: Delay Report', () => {

  const from = moment(new Date(1487076708000)).utc().format('YYYY-MM-DDTHH:MM');
  let dispatchMock;
  let getStateMock;
  let stateMock;

  beforeEach(() => {
    stateMock = {};
    metricsActions.fetchDeliverability = jest.fn(() => [{ count_accepted: 100, count_delay: 1 }]);
    metricsHelpers.getQueryFromOptions.mockImplementation(() => ({ from }));

    dispatchMock = jest.fn((a) => Promise.resolve(a));
    getStateMock = jest.fn(() => stateMock);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should dispatch delay reasons by domain and refresh table', async() => {
    const thunk = delayReport.loadDelayReasonsByDomain();
    await thunk(dispatchMock, getStateMock);

    // can add same kind of expectations here on mock calls, just like bounce report action tests

    expect(dispatchMock.mock.calls).toMatchSnapshot();
  });

  it('should dispatch delay metrics and refresh the metrics', async() => {
    const thunk = delayReport.loadDelayMetrics();
    await thunk(dispatchMock, getStateMock);

    // can add same kind of expectations here on mock calls, just like bounce report action tests

    expect(dispatchMock.mock.calls).toMatchSnapshot();
  });

});
