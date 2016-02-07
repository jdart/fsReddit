
import {default as isomorphicFetch} from 'isomorphic-fetch';
import C from './consts';
import {promiseConsts} from '../utils';
import set from 'lodash/set';


function fetcher(id) {
  return isomorphicFetch('http://gfycat.com/cajax/get/' + id);
}

export function fetch(id) {
  return {
    type: Object.keys(promiseConsts(C.GFYCAT_FETCH)),
    payload: {
      promise: fetcher(id)
        .then(response => response.json())
        .then(response => set(response, 'id', id)),
      data: {id}
    }
  };
}

