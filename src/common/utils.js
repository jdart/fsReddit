
import _ from 'lodash';

export function arrayToKeyValuePairs(array) {
  return array.reduce((hash, next) => _.set(hash, next, next), {});
}

export function promiseConsts(base) {
  if (_.isArray(base))
    return _.merge(... base.map(promiseConsts));

  return arrayToKeyValuePairs(
      ['PENDING', 'SUCCESS', 'ERROR']
        .map((step) => [base, '_', step].join(''))
    );
}

export function genConsts(simple, promise) {
  return _.merge(
    arrayToKeyValuePairs(simple),
    arrayToKeyValuePairs(promise),
    promiseConsts(promise)
  );
}

