import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import asyncDispatcher from 'src/middleware/asyncDispatcher';
import ErrorTracker from 'src/helpers/errorTracker';
import rootReducer from 'src/reducers';

// necessary for redux devtools in development mode only
const composeEnhancers = process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line no-mixed-operators
const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(asyncDispatcher, thunk),
    applyMiddleware(ErrorTracker.middleware)
  )
);

export default store;
