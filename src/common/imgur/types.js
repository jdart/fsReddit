
import {Record, List} from 'immutable';

export const Query = Record({
  failed: false,
  fetching: null,
  entries: new List,
  index: 0,
});

export const Image = Record({
  id: null,
  preloaded: null,
  url: null,
  sqUrl: null,
  gifv: null,
  title: null,
  width: null,
  height: null,
  description: null,
});

