import ErrorTracker, { breadcrumbCallback, getEnricherOrDieTryin } from '../errorTracker';
import * as mockRaven from 'raven-js';

jest.mock('raven-js');

describe('.breadcrumbCallback', () => {
  it('returns false with blacklisted breadcrumb', () => {
    expect(breadcrumbCallback({ message: '@@redux-form/CHANGE' })).toBeFalsy();
  });

  it('returns breadcrumb', () => {
    const breadcrumb = { message: 'RECORD_ME' };
    expect(breadcrumbCallback(breadcrumb)).toEqual(breadcrumb);
  });
});

describe('.getEnricherOrDieTryin', () => {
  const getState = jest.fn();
  const enrich = getEnricherOrDieTryin({ getState });

  beforeEach(() => { getState.mockReset(); });

  it('with current user', () => {
    const currentUser = { access_level: 'admin', customer: '123', username: 'test-user' };
    getState.mockReturnValue({ currentUser });
    expect(enrich({ logger: 'test' })).toMatchSnapshot();
  });

  it('without current user', () => {
    const currentUser = {};
    getState.mockReturnValue({ currentUser });
    expect(enrich({ logger: 'test' })).toMatchSnapshot();
  });

  it('with tags', () => {
    const currentUser = { customer: '123' };
    getState.mockReturnValue({ currentUser });
    expect(enrich({ logger: 'test', tags: { tenant: 'test' }})).toMatchSnapshot();
  });
});

describe('.install', () => {
  let config;
  let install;
  const store = jest.fn();

  beforeEach(() => {
    config = jest.spyOn(mockRaven, 'config').mockReturnThis();
    install = jest.spyOn(mockRaven, 'install');
  });

  afterEach(() => {
    config.mockRestore();
    install.mockRestore();
  });

  it('does nothing when not configured', () => {
    ErrorTracker.install({}, store);
    expect(config).not.toHaveBeenCalled();
  });

  it('installs error tracking service with configuration', () => {
    ErrorTracker.install({ sentry: {}}, store);
    expect(config).toHaveBeenCalled();
  });
});

describe('.report', () => {
  let captureException;
  let isSetup;
  const error = new Error('Oh no!');

  beforeEach(() => {
    captureException = jest.spyOn(mockRaven, 'captureException');
    isSetup = jest.spyOn(mockRaven, 'isSetup');
  });

  afterEach(() => {
    captureException.mockRestore();
    isSetup.mockRestore();
  });

  it('does nothing when not setup', () => {
    isSetup.mockReturnValue(false);
    ErrorTracker.report('test-logger', error);
    expect(captureException).not.toHaveBeenCalled();
  });

  it('sends error when setup', () => {
    isSetup.mockReturnValue(true);
    ErrorTracker.report('test-logger', error);
    expect(captureException).toHaveBeenCalledWith(error, { logger: 'test-logger' });
  });
});
