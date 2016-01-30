
import {setQueryNeedsMore} from '../utils';
import {Query} from '../content/types';
import {List} from 'immutable';

import {
  expect,
} from '../../../../test/mochaTestHelper';

const needsMoreQuery = Query({
  entries: new List([1, 2, 3, 4, 5]),
  needsMore: false,
  index: 3,
  after: true,
  fetching: false,
});

describe('reddit content utils', () => {
  describe('setQueryNeedsMore()', () => {
    it('set needsMore when on the second last index', () => {
      let query = setQueryNeedsMore(needsMoreQuery);
      expect(query.needsMore).to.equal(true);
      query = needsMoreQuery.set('index', 4);
      expect(query.needsMore).to.equal(false);
      query = needsMoreQuery.set('index', 5);
      expect(query.needsMore).to.equal(false);
      query = needsMoreQuery.set('index', 2);
      expect(query.needsMore).to.equal(false);
    });
  });
});
