
import {Record, List, Map} from 'immutable';
import {Subreddits, Oauth, OauthData} from './types';
import api from '../api';
import window from '../window';
import getRandomString from '../../lib/getRandomString';
import {invalidate, invalidateIf401} from '../utils';
import C from './consts';
import RCC from '../content/consts';

const InitialState = Record({
  authenticated: false,
  oauth: new Oauth,
  details: new Map,
  loaded: false,
  subreddits: new Subreddits,
  api: null,
});

const initialState = new InitialState();

export default function redditUserReducer(state = initialState, action) {
  const {payload} = action;
  const oauth = (payload && payload.oauth) || null;

  switch (action.type) {

    case 'REDUX_STORAGE_LOAD': {
      const newState = state.set('loaded', true);
      if (!payload.redditUser)
        return newState;
      const {access_token, expiry} = payload.redditUser.oauth.data;
      if (expiry && expiry > Date.now())
        return newState;
      if (access_token)
        api.auth(access_token);
      return newState
        .mergeIn(['oauth', 'data'], payload.redditUser.oauth.data)
        .mergeIn(['details'], payload.redditUser.details)
        .set('api', access_token ? api : null)
        .setIn(['subreddits', 'fetching'], access_token ? null : false)
        .setIn(['authenticated'], access_token ? true : false);
    }

    case C.REDDIT_USER_LOGIN: {
      const oauthState = getRandomString();
      window.location = api.getAuthUrl(oauthState);
      return state;
    }

    case C.REDDIT_USER_LOGIN_VALIDATE_PENDING: {
      return invalidate(state)
        .setIn(['oauth', 'fetching'], true);
    }

    case C.REDDIT_USER_LOGIN_VALIDATE_SUCCESS: {
      const expiry = Date.now() + parseInt(oauth.expires_in, 10) * 1000;
      return state
        .set('api', api)
        .setIn(['oauth', 'fetching'], false)
        .setIn(['authenticated'], true)
        .mergeIn(['details'], payload.me)
        .setIn(['oauth', 'data'], OauthData(oauth))
        .setIn(['oauth', 'data', 'expiry'], expiry)
        .setIn(['subreddits', 'fetching'], null)
        .setIn(['subreddits', 'list'], new List);
    }

    case C.REDDIT_USER_LOGIN_VALIDATE_ERROR: {
      return state.setIn(['oauth', 'fetching'], false);
    }

    case C.REDDIT_USER_FETCH_SUBREDDITS_PENDING: {
      return state.setIn(['subreddits', 'fetching'], true);
    }

    case C.REDDIT_USER_FETCH_SUBREDDITS_SUCCESS: {
      let extras = ['all'];
      if (state.get('authenticated'))
        extras.push('friends');
      return state.updateIn(['subreddits', 'list'], list => new List([
        ...extras,
        ...action.payload.data.children.map(sr => sr.data.display_name)
      ]))
      .setIn(['subreddits', 'fetching'], false);
    }

    case C.REDDIT_USER_FETCH_SUBREDDITS_ERROR: {
      return invalidateIf401(state, action.payload.status)
        .setIn(['subreddits', 'fetching'], false)
        .setIn(['subreddits', 'failed'], true);
    }

    case C.REDDIT_USER_SESSION_EXPIRED: {
      return invalidate(state);
    }

    case RCC.REDDIT_CONTENT_FETCH_ENTRIES_SUCCESS: {
      if (payload.error || !payload.data)
        return invalidate(state);
      return state;
    }
    case RCC.REDDIT_CONTENT_FETCH_COMMENTS_ERROR: {}
    case RCC.REDDIT_CONTENT_FETCH_ENTRIES_ERROR: {
      return invalidateIf401(state, action.payload.status);
    }
  }

  return state;
}
