
import {default as isomorphicFetch} from 'isomorphic-fetch';
import C from './consts';
import {promiseConsts} from '../utils';
import set from 'lodash/set';

function fetcher(url) {
  return isomorphicFetch([
    '/api/v1/readability/parse',
    '?url=' + encodeURIComponent(url),
  ].join(''), {
  });
}

export function fetch(url) {
  return {
    type: Object.keys(promiseConsts(C.READABILITY_FETCH)),
    payload: {
      promise: fetcher(url)
        .then(response => response.json())
        .then(response => set(response, 'url', url)),
      data: {url}
    }
  };
}

