
import C from './consts';
import {Record, Map} from 'immutable';
import {Query} from './types';

const InitialState = Record({
  queries: new Map,
});
const initialState = new InitialState;
const revive = () => initialState;

export default function vimeoReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return revive();

  switch (action.type) {

    case C.VIMEO_FETCH_PENDING: {
      const id = action.payload.id;
      return state.setIn(
        ['queries', id],
        new Query({fetching: true})
      );
    }

    case C.VIMEO_FETCH_SUCCESS: {
      const id = action.payload.id;
      return state.mergeIn(
        ['queries', id, 'data'],
        action.payload
      )
      .setIn(
        ['queries', 'id', 'fetching'],
        false
      );
    }

    case C.VIMEO_FETCH_ERROR: {
      return state.setIn(
        ['queries', 'id', 'fetching'],
        false
      );
    }
  }

  return state;
}
