
import fetch from 'isomorphic-fetch';
import C from './consts';
import { promiseConsts } from '../utils';
import set from 'lodash/object/set';


function fetcher(id) {
  return fetch('https://api.streamable.com/videos/' + id);
}

export function streamableFetch(id) {
  return {
    type: Object.keys(promiseConsts(C.STREAMABLE_FETCH)),
    payload: {
      promise: fetcher(id)
        .then(response => response.json())
        .then(response => set(response, 'id', id)),
      data: { id }
    }
  };
}

