
import url from 'url';
import basename from 'basename';

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
    id: id.split('/')[0],
  };
}
