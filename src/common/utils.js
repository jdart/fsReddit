
import isArray from 'lodash/lang/isArray';
import merge from 'lodash/object/merge';
import set from 'lodash/object/set';

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

