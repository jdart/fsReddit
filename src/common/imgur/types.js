
import {Record, List} from 'immutable';

export const Query = Record({
  isFetching: null,
  entries: new List,
  index: 0,
});
