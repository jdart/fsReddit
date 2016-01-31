
import C from './consts';
import {redditQueryIndex} from '../reddit/content/actions';
import {entryAtOffset} from '../reddit/utils';

export function readerSecondaryNav(id, prev, next, first, last, title) {
  return {
    type: C.READER_SECONDARY_NAV,
    payload: {
      id,
      prev,
      next,
      first,
      last,
      title
    }
  };
}

export function readerQuery(id) {
  return {
    type: C.READER_QUERY,
    payload: {id},
  };
}

export function readerReader() {
  return readerNav(0);
}

export function readerNav(offset) {
  return ({dispatch, getState}) => {
    const state = getState();
    const {queries, entries} = state.redditContent;
    const query = queries.get(state.reader.query);

    dispatch(redditQueryIndex(state.reader.query, offset));

    return {
      type: C.READER_NAV,
      payload: {
        previous: entryAtOffset(query, entries, -1),
        current: entryAtOffset(query, entries, 0),
        next: entryAtOffset(query, entries, 1),
      },
    };
  };
}

