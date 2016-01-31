
import C from './consts';
import {asyncRedditAction} from '../utils';

export function redditFetchComments(api, id) {
  return asyncRedditAction(
    api,
    C.REDDIT_CONTENT_FETCH_COMMENTS,
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

export function redditFetchEntries(api, url, after) {
  return redditFetchListing(C.REDDIT_CONTENT_FETCH_ENTRIES, api, url, after);
}

export function redditQueryIndex(url, offset) {
  return {
    type: C.REDDIT_CONTENT_QUERY_INDEX,
    payload: {
      url,
      offset
    }
  };
}

export function redditIframeLoaded(entry, time) {
  return {
    type: C.REDDIT_CONTENT_IFRAME_LOADED,
    payload: {
      entry,
      time
    }
  };
}

