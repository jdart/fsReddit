
import api from './api';
import C from './consts';
import { promiseConsts } from '../utils';
import fetch from 'isomorphic-fetch';
import queryString from 'query-string';
import merge from 'lodash/object/merge';

function asyncAction(type, promise, payload = {}) {
  return {
    type: Object.keys(promiseConsts(type)),
    payload: {
      promise: promise.then(response => merge(response, payload)),
      data: payload
    },
  };
}

function asyncRedditAction(api, type, action, url, options = {}, payload = {}) {
  if (api)
    return asyncAction(
      type,
      api(url)[action](options),
      payload
    );

  return asyncUnauthRedditAction(type, action, url, options, payload);
}

function asyncUnauthRedditAction(type, action, url, options = {}, payload = {}) {
  const fullUrl = [
    'https://api.reddit.com',
    url,
    '?', queryString.stringify(options),
  ].join('');

  return asyncAction(
    type,
    fetch(fullUrl).then(response => response.json()),
    payload
  );
}

export function redditFriend(api, author) {
  return asyncRedditAction(
    api,
    C.REDDIT_FRIEND,
    'put',
    '/api/v1/me/friends/' + author,
    {json: JSON.stringify({name: author})},
    {author}
  );
}

export function redditEntryPreload(entry, extra) {
  return {
    type: C.REDDIT_ENTRY_PRELOADED,
    payload: {entry, extra}
  };
}

export function redditNavActions(id, prev, next, first, last, title) {
  return {
    type: C.REDDIT_NAV_ACTIONS,
    payload: {
      id,
      prev,
      next,
      first,
      last,
      title
    }
  }
}

export function redditFetchComments(api, id) {
  return asyncRedditAction(
    api,
    C.REDDIT_FETCH_COMMENTS,
    'get',
    `/comments/${id}.json`,
    {sort: 'hot', raw_json: 1},
    {id},
  );
}

export function redditFetchListing(type, api, url, after) {
  return asyncRedditAction(
    api,
    type,
    'get',
    `${url}.json`,
    {after, raw_json: 1},
    {url, after}
  );
}

export function redditVote(api, entry) {
  const dir = entry.get('likes') ? 0 : 1;
  const data = {entry, dir};

  return asyncRedditAction(
    api,
    C.REDDIT_VOTE,
    'post',
    '/api/vote',
    {dir, id: 't3_' + entry.get('id')},
    data
  );
}

export function redditFetchEntries(api, url, after) {
  return redditFetchListing(C.REDDIT_FETCH_ENTRIES, api, url, after);
}

export function redditFetchSubreddits(api) {

  return asyncRedditAction(
    api,
    C.REDDIT_FETCH_SUBREDDITS,
    'get',
    api ? '/subreddits/mine/subscriber' : '/subreddits/default',
    {limit: 100}
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

export function redditIframeLoaded(entry, time) {
  return {
    type: C.REDDIT_IFRAME_LOADED,
    payload: {
      entry,
      time
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

