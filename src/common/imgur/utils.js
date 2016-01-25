
import url from 'url';
import {debounce} from 'lodash';

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

