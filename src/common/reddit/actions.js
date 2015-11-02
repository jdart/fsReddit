
import api from './api';
import Promise from 'bluebird';
import C from './consts';
import { promiseConsts } from '../utils';

function asyncRedditAction(type, api, url, options = {}) {
  return asyncAction(
    type,
    api(url).get(options)
  );
}

function asyncAction(type, promise, payload) {
  return {
    type: Object.keys(promiseConsts(type)),
    payload: { promise, data: payload },
  };
}

export function redditNavActions(id, prev, next) {
  return {
    type: C.REDDIT_NAV_ACTIONS,
    payload: {
      id,
      prev,
      next
    }
  }
}

export function redditFetchListing(type, api, url, after) {
  const params = { url, after };
  return asyncAction(
    type,
    api(url + '.json')
      .get({ after, raw_json: 1 })
      .then(response => _.set(response, 'params', params)),
    { params },
  );
}

export function redditFetchEntries(api, url, after) {
  return redditFetchListing(C.REDDIT_FETCH_ENTRIES, api, url, after);
}

export function redditFetchSubreddits(api) {
  return asyncRedditAction(
    C.REDDIT_FETCH_SUBREDDITS,
    api,
    '/subreddits/mine/subscriber',
    { limit: 100 }
  );
}

export function redditQueryIndex(url, index) {
  return {
    type: C.REDDIT_QUERY_INDEX,
    payload: {
      url,
      index
    }
  };
}

export function redditFetchPost(id) {
  return {
    type: promiseConsts(C.REDDIT_FETCH_POST),
    payload: {
      promise: api('')
    }
  };
}

export function redditLoggedIn(history) {
  return {
    type: C.REDDIT_LOGGED_IN,
    payload: {
      history
    }
  };
}

export function redditLogin() {
  return {
    type: C.REDDIT_LOGIN,
    payload: {}
  };
}

export function redditLoginValidate(oauth) {
  return asyncAction(
    C.REDDIT_LOGIN_VALIDATE,
    authenticatedApi(oauth).then(api => { return { oauth, api }; })
  );
}

function authenticatedApi(oauth) {
  return api.auth(oauth.access_token).then(() => api)
}

