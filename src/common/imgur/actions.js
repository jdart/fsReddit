
import fetch from 'isomorphic-fetch';
import C from './consts';
import {promiseConsts} from '../utils';
import set from 'lodash/object/set';
import Promise from 'bluebird';
import {parse} from './utils';

const maxAge = 60 * 60 * 24 * 30;

function imgurRobustFetcher(id, album, created) {
  if (album)
    return imgurFetchType('album', id);

  // yikes
  return imgurFetchType('image', id)
  .then(response => {
    if (response.status !== 200)
      return imgurFetchType('album', id);

    return response.json()
    .then(imageResponse => {
      const imageDiff = Math.abs(created - imageResponse.data.datetime);
      if (imageDiff <= maxAge)
        return imageResponse;

      return imgurFetchType('album', id)
      .then(response => response.json())
      .then(galleryResponse => {
        if (galleryResponse.status !== 200)
          return imageResponse;

        const galleryDiff = Math.abs(created - galleryResponse.data.datetime);
        return galleryDiff < imageDiff ? galleryResponse : imageResponse;
      });
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
    let img = new Image; //eslint-disable-line no-undef
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

