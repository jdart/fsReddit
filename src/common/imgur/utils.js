
import url from 'url';
import {get, debounce, set, union, includes} from 'lodash';
import {Image} from './types';
import {List} from 'immutable';

const typeMatchers = [{
  type: 'album',
  re: /^\/a\//,
}, {
  type: 'gallery',
  re: /^\/gallery\//,
}, {
  type: false,
  re: /^\//,
}];

export function parse(imgurUrl) {
  const parts = url.parse(imgurUrl);
  const types = typeMatchers.filter(({re}) => re.test(parts.pathname));
  const id = typeMatchers
    .reduce((pathname, {re}) => pathname.replace(re, ''), parts.pathname);
  return {
    type: types[0].type,
    id: id.replace(/\W/, '/').split('/')[0],
  };
}

function nextInQueue(imgur, action) {
  const queue = imgur.get('preloadQueue');

  if (!queue.get('images').size || queue.get('working'))
    return;

  const key = queue.get('images').first();
  action(imgur.getIn(['images', key]));
}

export const runQueue = debounce(nextInQueue, 50, {leading: true});

export function imagesArrayToKVP(data) {
  return data.reduce(
    (output, image) => set(output, image.id, new Image({
      id: image.id,
      url: image.link,
      sqUrl: image.link.replace(/\.jpg$/, 'h.jpg'),
      gifv: image.mp4,
      title: image.title,
      description: image.description,
      width: image.width,
      height: image.height,
    })),
    {}
  );
}

export function responseToImageArray(response) {
  const images = get(response, 'data.images');
  if (response.status !== 200 || get(images, 'length') === 0)
    return [{
      id: '404',
      link: 'http://s.imgur.com/images/404/giraffeweyes.png',
      title: null,
      description: null,
      height: null,
      width: null,
    }];

  return images ? images : [response.data];
}

export function addToQueue(state, add) {
  const prevQueue = state.preloadQueue.get('images').toJS();
  const newQueue = union(prevQueue, add)
    .filter(key => !state.getIn(['images', key, 'preloaded']));
  return flagPreloading(
    state.setIn(['preloadQueue', 'images'], new List(newQueue)),
    newQueue
  );
}

export function flagPreloading(state, keys) {
  return state.update('images', images =>
    images.map((image, id) => {
      const oldVal = image.get('preloaded');
      if (oldVal || !includes(keys, id))
        return image;
      return image.set('preloaded', false);
    })
  );
}

export function imgurQuery(url, imgur) {
  const request = parse(url).id;
  return imgur.getIn(['queries', request]);
}

