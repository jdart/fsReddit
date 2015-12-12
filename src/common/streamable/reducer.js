
import C from './consts';
import {Record, List, Map} from 'immutable';
import {Query} from './types';

const InitialState = Record({
  queries: new Map,
});
const initialState = new InitialState;
const revive = () => initialState;

export default function streamableReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return revive();

  switch (action.type) {

    case C.STREAMABLE_FETCH_PENDING: {
      const id = action.payload.id;
      return state.setIn(
        ['queries', id],
        new Query({fetching: true})
      );
    }

    case C.STREAMABLE_FETCH_SUCCESS: {
      console.log(action.payload)
      const id = action.payload.id;
      return state.mergeIn(
        ['queries', id, 'data'],
        action.payload.files
      )
      .setIn(
        ['queries', 'id', 'fetching'],
        false
      );
    }

    case C.STREAMABLE_FETCH_ERROR: {
      return state.setIn(
        ['queries', 'id', 'fetching'],
        false
      );
    }
  }

  return state;
}
