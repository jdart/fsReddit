
import url from 'url';

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
