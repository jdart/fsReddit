import appReducer from './app/reducer';
import createLogger from 'redux-logger';
import fetch from './fetch';
import injectDependencies from './lib/injectDependencies';
import promiseMiddleware from 'redux-promise-middleware';
import stateToJS from './lib/stateToJS';
import {applyMiddleware, createStore} from 'redux';
import storage from 'redux-storage';

export default function configureStore({engine, initialState}) {

  // Inject services for actions.
  const dependenciesMiddleware = injectDependencies(
    {fetch},
    {}
  );

  const middleware = [
    dependenciesMiddleware,
    promiseMiddleware
  ];

  if (engine) {
    // The order is important.
    engine = storage.decorators.filter(engine, [
      ['redditUser', 'oauth', 'data'],
      ['redditUser', 'details'],
    ]);
    engine = storage.decorators.debounce(engine, 1500);
    middleware.push(storage.createMiddleware(engine));
  }

  const loggerEnabled =
    process.env.NODE_ENV !== 'production' &&
    process.env.IS_BROWSER;

  if (loggerEnabled) {
    const logger = createLogger({
      collapsed: true,
      stateTransformer: stateToJS
    });
    // Logger must be the last middleware in chain.
    middleware.push(logger);
  }

  const createStoreWithMiddleware = applyMiddleware(...middleware);
  const store = createStoreWithMiddleware(createStore)(appReducer, initialState);

  // Enable hot reload where available.
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers.
    module.hot.accept('./app/reducer', () => {
      const nextAppReducer = require('./app/reducer');
      store.replaceReducer(nextAppReducer);
    });
  }

  return store;
}
