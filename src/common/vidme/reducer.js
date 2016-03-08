
import C from './consts';
import {Record, Map} from 'immutable';
import {Query} from './types';

const InitialState = Record({
  queries: new Map,
});
const initialState = new InitialState;
const revive = () => initialState;

export default function vidmeReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return revive();

  switch (action.type) {

    case C.VIDME_FETCH_PENDING: {
      const url = action.payload.url;
      return state.setIn(
        ['queries', url],
        new Query({fetching: true})
      );
    }

    case C.VIDME_FETCH_SUCCESS: {
      const url = action.payload.url;
      return state.mergeIn(
        ['queries', url, 'data'],
        action.payload.video
      )
      .setIn(
        ['queries', 'url', 'fetching'],
        false
      );
    }

    case C.VIDME_FETCH_ERROR: {
      return state.setIn(
        ['queries', 'url', 'fetching'],
        false
      );
    }
  }

  return state;
}
