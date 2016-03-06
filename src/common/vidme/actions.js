
import {default as isomorphicFetch} from 'isomorphic-fetch';
import C from './consts';
import {promiseConsts} from '../utils';
import set from 'lodash/set';


function fetcher(url) {
  return isomorphicFetch('https://api.vid.me/videoByUrl/' + encodeURIComponent(url));
}

export function fetch(url) {
  return {
    type: Object.keys(promiseConsts(C.VIDME_FETCH)),
    payload: {
      promise: fetcher(url)
        .then(response => response.json())
        .then(response => set(response, 'url', url)),
      data: {url}
    }
  };
}

