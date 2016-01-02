import App from './app/App.react';
import NotFound from './notfound/Page.react';
import React from 'react';
import Home from './home/Home.react';
import Subreddit from './reader/Subreddit.react';
import User from './reader/User.react';
import Upvoted from './reader/Upvoted.react';
import Oauth from './auth/Oauth.react';
import Single from './reader/Single.react';
import {IndexRoute, Route} from 'react-router';
import ga from 'react-ga';


export default function createRoutes(getState) {

  if (typeof window !== 'undefined')
    ga.initialize('UA-70268033-1');

  function requireAuth(nextState, replaceState) {
    const loggedInUser = getState().users.viewer;
    if (!loggedInUser) {
      replaceState({nextPathname: nextState.location.pathname}, '/login');
    }
  }

  function log(nextState) {
    if (typeof window === 'undefined')
      return;
    ga.pageview(nextState.location.pathname);
  }

  return (
    <Route component={App} path="/">
      <IndexRoute onEnter={log} component={Home} />
      <Route onEnter={log} component={Oauth} path="r/oauth" />
      <Route onEnter={log} component={Subreddit} path="f/" />
      <Route onEnter={log} component={Subreddit} path="f/:sort" />
      <Route onEnter={log} component={Subreddit} path="r/:name" />
      <Route onEnter={log} component={Subreddit} path="r/:name/:sort" />
      <Route onEnter={log} component={Single} path="c/:id" />
      <Route onEnter={log} component={User} path="u/:name" />
      <Route onEnter={log} component={Upvoted} path="upvoted" />
      <Route onEnter={log} component={NotFound} path="*" />
    </Route>
  );

}
