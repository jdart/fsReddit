
import C from './consts';
import {redditQueryIndex} from '../reddit/content/actions';
import {entryAtOffset} from '../reddit/utils';

export function readerQuery(id) {
  return {
    type: C.READER_QUERY,
    payload: {id},
  };
}

export function readerNav(offset) {
  return ({dispatch, getState}) => {
    const {reader} = getState();
    dispatch(redditQueryIndex(reader.query, offset));

    const state = getState();
    const {queries, entries} = state.redditContent;
    const query = queries.get(state.reader.query);

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

