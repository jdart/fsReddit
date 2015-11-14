
import {Record, List} from 'immutable';

export const Query = Record({
  fetching: null,
  entries: new List,
  index: 0,
});
