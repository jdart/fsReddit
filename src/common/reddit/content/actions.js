
import C from './consts';
import {asyncRedditAction} from '../utils';
import {promiseConsts} from '../../utils';

export function contentViewMode(id, mode) {
  return {
    type: C.REDDIT_CONTENT_VIEW_MODE,
    payload: {id, mode},
  };
}
export function fetchComments(api, id) {
  return asyncRedditAction(
    api,
    C.REDDIT_CONTENT_FETCH_COMMENTS,
    'get',
    `/comments/${id}.json`,
    {sort: 'hot', raw_json: 1},
    {id},
  );
}

function fetchListing(type, api, url, after) {
  return asyncRedditAction(
    api,
    type,
    'get',
    `${url}.json`,
    {after, raw_json: 1},
    {url, after}
  );
}

export function fetchEntries(api, url, after) {
  return fetchListing(C.REDDIT_CONTENT_FETCH_ENTRIES, api, url, after);
}

export function queryIndex(url, offset) {
  return {
    type: C.REDDIT_CONTENT_QUERY_INDEX,
    payload: {
      url,
      offset
    }
  };
}

export function iframeLoaded(entry, time) {
  return {
    type: C.REDDIT_CONTENT_IFRAME_LOADED,
    payload: {
      entry,
      time
    }
  };
}

export function fetchMimeType(entry) {
  const promise = new Promise((resolve, reject) => {
    const img = new Image;
    img.onload = () => resolve({entry});
    img.onerror = (e) => reject({entry, e});
    img.src = entry.url;
  });

  return {
    type: Object.keys(promiseConsts(C.REDDIT_CONTENT_FETCH_MIME_TYPE)),
    payload: {
      data: {entry},
      promise,
    }
  };
}
