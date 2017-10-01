import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from 'react-router';
import configureStore from '../common/configureStore';
import {browserHistory} from 'react-router'
import createEngine from 'redux-storage/engines/localStorage';
import createRoutes from './createRoutes';
import {Provider} from 'react-redux';
import storage from 'redux-storage';
import ga from 'react-ga';

const app = document.getElementById('app');
const engine = createEngine('fs-reddit');
const initialState = window.__INITIAL_STATE__;
const store = configureStore({engine, initialState});
const routes = createRoutes(store.getState);

if (typeof window !== 'undefined')
  ga.initialize('UA-70268033-1');

function logPageView(nextState) {
  if (typeof window === 'undefined' || !nextState || !nextState.location)
    return;
  ga.pageview(nextState.location.pathname);
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory} onUpdate={logPageView}>
      {routes}
    </Router>
  </Provider>,
  app,
  () => {
    storage.createLoader(engine)(store);
  }
);
