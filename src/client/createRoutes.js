import App from './app/App.react';
import NotFound from './notfound/Page.react';
import React from 'react';
import Home from './reddit/Home.react';
import Subreddit from './reddit/Subreddit.react';
import User from './reddit/User.react';
import Oauth from './reddit/Oauth.react';
import {IndexRoute, Route} from 'react-router';

export default function createRoutes(getState) {

  function requireAuth(nextState, replaceState) {
    const loggedInUser = getState().users.viewer;
    if (!loggedInUser) {
      replaceState({nextPathname: nextState.location.pathname}, '/login');
    }
  }

  return (
    <Route component={App} path="/">
      <IndexRoute component={Home} />
      <Route component={Oauth} path="r/oauth" />
      <Route component={Subreddit} path="f/" />
      <Route component={Subreddit} path="f/:sort" />
      <Route component={Subreddit} path="r/:name" />
      <Route component={Subreddit} path="r/:name/:sort" />
      <Route component={User} path="u/:name" />
      <Route component={NotFound} path="*" />
    </Route>
  );

}
