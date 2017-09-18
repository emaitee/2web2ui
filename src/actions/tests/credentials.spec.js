import { createMockStore } from '../../config/tests/mockStore';
import * as Actions from '../credentials';

jest.mock('../helpers/sparkpostApiRequest', () => jest.fn((action) => action));

describe('fetchApiKeys()', () => {
  it('dispatches the correct action when no keys are present', () => {
    const store = createMockStore({ credentials: { keys: []}});

    store.dispatch(Actions.fetchApiKeys());
    expect(store.getActions()).toMatchSnapshot();
  });

  it('does not dispatch when keys are present', () => {
    const store = createMockStore({ credentials: { keys: [{ label: 'a' }]}});

    store.dispatch(Actions.fetchApiKeys());
    expect(store.getActions()).toMatchSnapshot();
  });
});
