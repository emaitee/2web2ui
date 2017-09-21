import { createMockStore } from '../../config/tests/mockStore';
import * as Actions from '../credentials';

jest.mock('../helpers/sparkpostApiRequest', () => jest.fn((action) => action));

describe('listApiKeys()', () => {
  it('dispatches the correct action when no keys are present', () => {
    const store = createMockStore({ credentials: { keys: []}});

    store.dispatch(Actions.listApiKeys());
    expect(store.getActions()).toMatchSnapshot();
  });

  it('does not dispatch when keys are already loaded', () => {
    const store = createMockStore({
      credentials: { keysLoaded: true }
    });

    store.dispatch(Actions.listApiKeys());
    expect(store.getActions()).toHaveLength(0);
  });
});

describe('listGrants()', () => {
  it('dispatches the correct action when no grants are present', () => {
    const store = createMockStore({ credentials: { grants: []}});

    store.dispatch(Actions.listGrants());
    expect(store.getActions()).toMatchSnapshot();
  });

  it('does not dispatch when grants are already loaded', () => {
    const store = createMockStore({
      credentials: { grantsLoaded: true }
    });

    store.dispatch(Actions.listGrants());
    expect(store.getActions()).toHaveLength(0);
  });
});
