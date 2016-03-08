
import fetchJsonp from 'fetch-jsonp';

import C from './consts';
import {promiseConsts} from '../utils';
import set from 'lodash/set';


function fetcher(url) {
  return fetchJsonp('https://api.instagram.com/oembed/?url=' + url);
}

export function fetch(id) {
  return {
    type: Object.keys(promiseConsts(C.INSTAGRAM_FETCH)),
    payload: {
      promise: fetcher(id)
        .then(response => response.json())
        .then(response => set(response, 'id', id)),
      data: {id}
    }
  };
}

