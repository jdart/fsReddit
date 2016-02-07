
import C from './consts';
import {queryIndex} from '../reddit/content/actions';
import {entryAtOffset} from '../reddit/utils';

export function query(id) {
  return {
    type: C.READER_QUERY,
    payload: {id},
  };
}

export function nav(offset) {
  return ({dispatch, getState}) => {
    const {reader} = getState();
    dispatch(queryIndex(reader.query, offset));

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

