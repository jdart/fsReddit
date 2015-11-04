
import C from './consts';
import _ from 'lodash';
import {Record, List, Map} from 'immutable';
import {User, Subreddits, Oauth, OauthData, Query, Comment, Comments} from './types';
import api from './api';
import window from './window';
import getRandomString from '../lib/getRandomString';
import localStorage from './localStorage';

const keys = {
  oauth: 'reddit_oauth_data',
  state: 'reddit_oauth_state'
};

const savedState = localStorage.get(keys.oauth, {});

const InitialState = Record({
  api: null,
  user: new User,
  entries: new Map,
  queries: new Map,
  subreddits: new Subreddits,
  navActions: new Map({
    up: null,
    down: null,
  }),
});
const initialState = new InitialState;
const revive = () => {
  const accessToken = savedState.access_token || null;
  if (accessToken)
    api.auth(accessToken);
  return initialState.merge({
    api,
    user: {
      authenticated: Boolean(accessToken),
      oauth: {
        data: savedState
      }
    }
  });
}

function invalidate(state) {
  localStorage.set(keys.state, null);
  localStorage.set(keys.oauth, {});
  return state.setIn(['user', 'oauth', 'data'], {})
    .setIn(['user', 'authenticated'], false);
}

function invalidateIf401(state, status) {
  if (status !== 401)
    return state;
  return invalidate(state);
}

export default function redditReducer(state = initialState, action) {
  const { payload } = action;
  const oauth = (payload && payload.oauth) || null;
  if (!(state instanceof InitialState)) return revive();

  switch (action.type) {

    case C.REDDIT_LOGIN: {
      const oauthState = getRandomString();
      localStorage.set(keys.state, oauthState);
      window.location = api.getAuthUrl(oauthState);
    }

    case C.REDDIT_LOGIN_VALIDATE_PENDING: {
      return invalidate(state)
        .setIn(['user', 'oauth', 'isFetching'], true);
    }

    case C.REDDIT_LOGIN_VALIDATE_SUCCESS: {
      localStorage.set(keys.oauth, oauth);
      return state.merge({
        api,
        user: {
          oauth: {
            data: oauth,
            isFetching: false,
          },
          authenticated: true
        }
      });
    }

    case C.REDDIT_LOGGED_IN: {
      action.payload.history.pushState(null, '/');
      return state;
    }

    case C.REDDIT_FETCH_ENTRIES_PENDING: {
      if (payload.params.after)
        return state.update('queries', queries => queries.update(
          payload.params.url,
          query => query.set('isFetching', true)
        ));
      return state.update('queries', queries => queries.set(
        payload.params.url,
        new Query({
          isFetching: true,
        })
      ));
    }

    case C.REDDIT_FETCH_ENTRIES_SUCCESS: {
      const key = payload.params.url;
      const data = payload.data;
      return state.update('queries', queries => queries.update(
        key,
        query => query
          .set('isFetching', false)
          .set('failed', false)
          .set('index', 0)
          .update('entries', entries => entries.concat(
            data.children
              .filter(entry => !entry.data.stickied)
              .map(entry => entry.data.id)
          ))
      ))
      .update('entries', entries =>
        entries.merge(data.children.reduce(
          (accu, entry) => _.set(
            accu,
            entry.data.id,
            _.merge(
              entry.data,
              { comments: new Comments }
            )
          ),
          {}
        ))
      );
    }

    case C.REDDIT_FETCH_ENTRIES_ERROR: {
      state = state.update('queries', queries =>
          queries.map(query =>
            query
              .set('isFetching', false)
              .set('failed', true)
          )
      );
      return invalidateIf401(state, action.payload.status);
    }

    case C.REDDIT_QUERY_INDEX: {
      return state.update('queries', queries => queries.update(
        action.payload.url,
        query => query.set('index', action.payload.index)
      ));
    }

    case C.REDDIT_NAV_ACTIONS: {
      const { prev, next, id } = action.payload;
      return state.update('navActions', navActions =>
        navActions.merge({
          id,
          up: prev,
          down: next
        })
      );
    }

    case C.REDDIT_FETCH_SUBREDDITS_SUCCESS: {
      return state.updateIn(['subreddits', 'list'], list => list.push(
        'all',
        'friends',
        ... action.payload.data.children.map(sr => sr.data.display_name)
      ))
      .setIn(['subreddits', 'isFetching'], false);
    }

    case C.REDDIT_FETCH_SUBREDDITS_ERROR: {
      return invalidateIf401(state, action.payload.status);
    }

    case C.REDDIT_FETCH_COMMENTS_PENDING: {
      console.log(action.payload.entry.get('id'));
      return state.update('entries', entries => entries.update(
        action.payload.entry.get('id'),
        entry => entry.set('isFetching', true)
      ));
    }

    case C.REDDIT_FETCH_COMMENTS_SUCCESS: {
      return state.update('entries', entries => entries.update(
        action.payload.entry.get('id'),
        entry => entry.update('comments', comments =>
          comments.set('children', action.payload.response[1].data.children)
            .set('isFetching', false)
        )
      ));
    }
  }

  return state;
}
