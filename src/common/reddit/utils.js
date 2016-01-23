
import fetch from 'isomorphic-fetch';
import {promiseConsts} from '../utils';
import queryString from 'query-string';
import merge from 'lodash/merge';

export function asyncAction(type, promise, payload = {}) {
  return {
    type: Object.keys(promiseConsts(type)),
    payload: {
      promise: promise.then(response => merge(response, payload)),
      data: payload
    },
  };
}

export function asyncRedditAction(api, type, action, url, options = {}, payload = {}) {
  if (api)
    return asyncAction(
      type,
      api(url)[action](options),
      payload
    );

  return asyncUnauthRedditAction(type, action, url, options, payload);
}

export function asyncUnauthRedditAction(type, action, url, options = {}, payload = {}) {
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

export function invalidate(state) {
  return state.setIn(['oauth', 'data'], {})
    .setIn(['authenticated'], false);
}

export function invalidateIf401(state, status) {
  if (status !== 401 && status !== 0)
    return state;
  return invalidate(state);
}
