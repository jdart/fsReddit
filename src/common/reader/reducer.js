
import C from './consts';
import {Record} from 'immutable';
import {Frame} from './types';
import {now} from '../utils';

const InitialState = Record({
  query: null,
  queryTimestamp: null,
  previous: new Frame(),
  current: new Frame(),
  next: new Frame(),
});

const initialState = new InitialState;
const revive = () => initialState;

export default function readerReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return revive();

  switch (action.type) {
    case C.READER_QUERY: {
      const {id} = action.payload;
      return state.set('query', id);
    }

    case C.READER_NAV: {
      const {previous, current, next} = action.payload;
      return state
        .set('queryTimestamp', now())
        .setIn(['previous', 'entry'], previous)
        .setIn(['current', 'entry'], current)
        .setIn(['next', 'entry'], next);
    }

  }

  return state;
}

