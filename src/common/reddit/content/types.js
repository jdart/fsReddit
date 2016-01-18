
import {Record, List, Map} from 'immutable';

export const Query = Record({
  fetching: true,
  didInvalidate: null,
  lastUpdated: null,
  failed: null,
  entries: new List,
  index: null,
  after: null,
});

export const Comments = Record({
  fetching: null,
  children: null
});

export const Comment = Record({
  data: new Map,
  children: new List
});

