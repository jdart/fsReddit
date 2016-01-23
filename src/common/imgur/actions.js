
import fetch from 'isomorphic-fetch';
import C from './consts';
import {promiseConsts} from '../utils';
import {set, without, concat, remove, clone, sortBy, filter} from 'lodash';
import Promise from 'bluebird';
import {parse} from './utils';

const maxAge = 60 * 60 * 24 * 30; //month
const imgurTypes = ['image', 'album', 'gallery'];

function imgurRobustFetcher(id, type, created) {
  const typeOrder = remove(concat([type], without(imgurTypes, type)));
  const typeTemplate = {response: null, age: null, key: null};
  const types = typeOrder.map((type) => set(clone(typeTemplate), 'key', type));
  return imgurFind(types, 0, id, created);
}

function chooseBest(types) {
  const failure = {status: 404};
  types = filter(
    remove(sortBy(types, 'age'), 'response'),
    (type) => type.age <= maxAge * 6
  );
  if (types.length)
    return types[0].response;
  return failure;
}

function imgurFind(types, index, id, created) {
  const type = types[index];
  const nextIndex = index + 1;
  const last = types.length <= nextIndex;
  const next = () => last
    ? chooseBest(types)
    : imgurFind(types, nextIndex, id, created);
  return imgurFetchType(type.key, id)
  .then(response => {
    if (response.status !== 200)
      return next();
    return response.json()
    .then(jsonResponse => {
      type.age = Math.abs(created - jsonResponse.data.datetime);
      type.response = jsonResponse;
      if (type.age <= maxAge)
        return type.response;
      return next();
    });
  });
}

function imgurFetchType(type, id) {
  return fetch(`https://api.imgur.com/3/${type}/${id}`, {headers: {
    Authorization: 'Client-ID bc4cacfc141d1b0'
  }});
}

function imageLoader(image, current, index) {
  return new Promise((resolve, reject) => {
    let img = new Image;
    img.onload = () => resolve({image, current, index});
    img.onerror = () => reject({image, current, index});
    img.src = image.get('url');
  });
}

export function imgurFetch(entry) {
  const parts = parse(entry.get('url'));
  return {
    type: Object.keys(promiseConsts(C.IMGUR_FETCH)),
    payload: {
      promise: imgurRobustFetcher(parts.id, parts.type, entry.get('created_utc'))
        .then(response => response.json ? response.json() : response)
        .then(response => set(response, 'reqid', parts.id)),
      data: {reqid: parts.id}
    }
  };
}

export function imgurStep(id, index) {
  return {
    type: C.IMGUR_STEP,
    payload: {reqid: id, index}
  };
}

export function imgurCacheImage(image, current, index) {
  return {
    type: Object.keys(promiseConsts(C.IMGUR_CACHE_IMAGE)),
    payload: {
      promise: imageLoader(image, current, index),
      data: {image}
    },
  };
}

export function imgurEnqueue(query, images) {
  return {
    type: C.IMGUR_ENQUEUE,
    payload: {images}
  };
}

export function imgurImageCached(image) {
  return {
    type: C.IMGUR_IMAGE_CACHED,
    payload: {image},
  };
}

