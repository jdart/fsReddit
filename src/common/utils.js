
import {isArray, merge, set} from 'lodash';
import url from 'url';

export function arrayToKeyValuePairs(array) {
  return array.reduce((hash, next) => set(hash, next, next), {});
}

export function promiseConsts(base) {
  if (isArray(base))
    return merge(... base.map(promiseConsts));

  return arrayToKeyValuePairs(
      ['PENDING', 'SUCCESS', 'ERROR']
        .map((step) => [base, '_', step].join(''))
    );
}

export function genConsts(simple, promise) {
  return merge(
    arrayToKeyValuePairs(simple),
    arrayToKeyValuePairs(promise),
    promiseConsts(promise)
  );
}

export function now() {
  return Math.floor(Date.now() / 1000);
}

export function extIn(...exts) {
  const regex = new RegExp('\.(' + exts.join('|') + ')$', 'i');
  return candidate => {
    const parts = url.parse(candidate);
    return regex.test(parts.pathname);
  };
}


