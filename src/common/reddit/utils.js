
import fetch from 'isomorphic-fetch';
import {promiseConsts} from '../utils';
import queryString from 'query-string';
import merge from 'lodash/merge';
import {Entry, Comments} from './content/types';
import {initialUnauthState} from './user/types';

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
  return initialUnauthState;
}

export function invalidateIf401(state, status) {
  if (status !== 401 && status !== 0)
    return state;
  return invalidate(state);
}

export function setQueryNeedsMore(query) {
  const {entries} = query;
  const needsMore = entries
    && entries.size > 2
    && query.after !== false
    && query.index === (entries.size - 2)
    && !query.fetching;
  return query.set('needsMore', needsMore);
}

export function appendQueryEntriesFromResponse(entries, children) {
  return entries.concat(
    children
      .filter(entry => !entry.data.stickied)
      .map(entry => entry.data.id)
  );
}

export function addNewEntriesFromResponse(entries, children) {
  return children.reduce((entries, child) =>
    entries.set(child.data.id, Entry(child.data)
      .merge({
        comments: new Comments,
        preloaded: false,
        iframeLoadMs: null,
      })),
    entries
  );
}

export function entryAtOffset(query, entries, offset = 0) {
  const index = query.index + offset;
  if (index < 0)
    return null;
  const entry = entries.get(query.entries.get(index));
  if (entry)
    return entry.id;
  return null;
}

