import cases from 'jest-in-case';
import suppressionReducer from '../suppressions';

const state = {
  list: [
    { 'recipient': 'bfle1m90k2@yahoo.com', 'description': '503: ', 'source': 'Bounce Rule', 'type': 'non_transactional' },
    { 'recipient': 'lf4qg05tfq@hotmail.com', 'description': '554: ', 'source': 'Bounce Rule', 'type': 'transactional', subaccount_id: '101' }
  ]
};

const TEST_CASES = {
  'matches suppressions correctly (excludes deleted one)': {
    type: 'DELETE_SUPPRESSION_SUCCESS',
    meta: { suppression: { recipient: 'bfle1m90k2@yahoo.com', type: 'non_transactional' }}
  },
  'matches suppressions with subaccount correctly (excludes deleted one)': {
    type: 'DELETE_SUPPRESSION_SUCCESS',
    meta: { suppression: { recipient: 'lf4qg05tfq@hotmail.com', type: 'transactional', subaccount_id: '101' }}
  },
  'when failed to create or update suppressions': {
    type: 'CREATE_OR_UPDATE_SUPPRESSIONS_FAIL',
    payload: { message: 'Oh no!' }
  },
  'when created suppressions': {
    type: 'CREATE_OR_UPDATE_SUPPRESSIONS_SUCCESS'
  },
  'when failed to parse suppressions file': {
    type: 'PARSE_SUPPRESSIONS_FILE_FAIL',
    payload: { message: 'Oh no!' }
  },
  'when parsed suppressions file': {
    type: 'PARSE_SUPPRESSIONS_FILE_SUCCESS'
  }
};

cases('Suppressions reducer', (action) => {
  expect(suppressionReducer(state, action)).toMatchSnapshot();
}, TEST_CASES);
