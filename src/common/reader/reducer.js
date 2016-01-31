
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
  secondaryNav: Record({
    id: null,
    prev: null,
    next: null,
    first: null,
    last: null,
    title: null,
  }),
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

    case C.READER_FRAME: {
      return state;
      //const {id, position} = action.payload;
      //return state.set([position, 'id'], id);
    }

    case C.READER_NAV: {
      const {previous, current, next} = action.payload;
      return state
        .set('queryTimestamp', now())
        .setIn(['previous', 'entry'], previous)
        .setIn(['current', 'entry'], current)
        .setIn(['next', 'entry'], next);
    }

    case C.READER_SECONDARY_NAV: {
      const {prev, next, first, last, id, title} = action.payload;
      return state.mergeIn(['secondaryNav'], {
        id,
        up: prev,
        down: next,
        first,
        last,
        title,
      });
    }

  }

  return state;
}

