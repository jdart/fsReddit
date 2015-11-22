
import fetch from 'isomorphic-fetch';
import C from './consts';
import { promiseConsts } from '../utils';
import set from 'lodash/object/set';
import Promise from 'bluebird';

function imgurFetcher(url) {
  return fetch('https://api.imgur.com/3/' + url, { headers: {
    Authorization: 'Client-ID bc4cacfc141d1b0'
  } });
}

function imageLoader(image, current, index) {
  return new Promise((resolve, reject) => {
    let img = new Image;
    img.onload = () => resolve({image, current, index});
    img.onerror = () => reject({image, current, index});
    img.src = image.get('url');
  });
}

export function imgurFetch(id) {
  return {
    type: Object.keys(promiseConsts(C.IMGUR_FETCH)),
    payload: {
      promise: imgurFetcher(id)
        .then(response => response.json())
        .then(response => set(response, 'reqid', id)),
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

export function imgurPreloadNext(image, current, index) {
  return {
    type: Object.keys(promiseConsts(C.IMGUR_PRELOAD_NEXT)),
    payload: {
      promise: imageLoader(image, current, index),
      data: { image }
    },
  };
}

