
import fetch from 'isomorphic-fetch';
import C from './consts';
import { promiseConsts } from '../utils';
import _ from 'lodash';


function fetcher(id) {
  return fetch('http://gfycat.com/cajax/get/' + id);
}

export function gfycatFetch(id) {
  return {
    type: Object.keys(promiseConsts(C.GFYCAT_FETCH)),
    payload: {
      promise: fetcher(id)
        .then(response => response.json())
        .then(response => _.set(response, 'id', id)),
      data: { id }
    }
  };
}

