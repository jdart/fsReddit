import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router';
import configureStore from '../common/configureStore';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import createEngine from 'redux-storage/engines/localStorage';
import createRoutes from './createRoutes';
import {Provider} from 'react-redux';
import storage from 'redux-storage';

const app = document.getElementById('app');
const engine = createEngine('fs-reddit');

const initialState = window.__INITIAL_STATE__;
const store = configureStore({engine, initialState});
const routes = createRoutes(store.getState);

ReactDOM.render(
  <Provider store={store}>
    <Router history={createBrowserHistory()}>
      {routes}
    </Router>
  </Provider>,
  app,
  () => {
    storage.createLoader(engine)(store);
  }
);
