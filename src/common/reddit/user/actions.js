
import api from '../api';
import C from './consts';
import {promiseConsts} from '../../utils';
import fetch from 'isomorphic-fetch';
import {asyncAction, asyncRedditAction, asyncUnauthRedditAction} from '../utils';

export function redditFriend(api, author) {
  return asyncRedditAction(
    api,
    C.REDDIT_USER_FRIEND,
    'put',
    '/api/v1/me/friends/' + author,
    {json: JSON.stringify({name: author})},
    {author}
  );
}

export function redditVote(api, entry) {
  const dir = entry.get('likes') ? 0 : 1;
  const data = {entry, dir};

  return asyncRedditAction(
    api,
    C.REDDIT_USER_VOTE,
    'post',
    '/api/vote',
    {dir, id: 't3_' + entry.get('id')},
    data
  );
}

export function redditFetchSubreddits(api) {

  return asyncRedditAction(
    api,
    C.REDDIT_USER_FETCH_SUBREDDITS,
    'get',
    api ? '/subreddits/mine/subscriber' : '/subreddits/default',
    {limit: 100}
  );
}

export function redditLoggedIn(history) {
  return {
    type: C.REDDIT_USER_LOGGED_IN,
    payload: {
      history
    }
  };
}

export function redditLogin() {
  return {
    type: C.REDDIT_USER_LOGIN,
    payload: {}
  };
}

export function redditLoginValidate(oauth) {
  return asyncAction(
    C.REDDIT_USER_LOGIN_VALIDATE,
    authenticatedApi(oauth)
      .then(api => {
        return api('/api/v1/me').get()
          .then(me => {
            return { oauth, api, me };
          });
      })
  );
}

function authenticatedApi(oauth) {
  return api.auth(oauth.access_token).then(() => api)
}

