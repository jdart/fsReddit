
import fetch from 'isomorphic-fetch';
import C from './consts';
import { promiseConsts } from '../utils';
import _ from 'lodash';

function imgurFetcher(url) {
  return fetch('https://api.imgur.com/3/' + url, { headers: {
    Authorization: 'Client-ID bc4cacfc141d1b0'
  } });
}

export function imgurFetch(id) {
  return {
    type: Object.keys(promiseConsts(C.IMGUR_FETCH)),
    payload: {
      promise: imgurFetcher(id)
        .then(response => response.json())
        .then(response => _.set(response, 'reqid', id)),
      data: { reqid: id }
    }
  };
}

export function imgurStep(id, index) {
  return {
    type: C.IMGUR_STEP,
    payload: { reqid: id, index }
  };
}
