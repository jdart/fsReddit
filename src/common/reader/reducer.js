
import C from './consts';
import {Record} from 'immutable';
import {now} from '../utils';
import {isFullscreen} from './utils';

const InitialState = Record({
  query: null,
  queryTimestamp: null,
  previous: null,
  current: null,
  next: null,
  fullscreen: isFullscreen(),
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

    case C.READER_FULLSCREEN: {
      const {enabled} = action.payload;
      return state.set('fullscreen', enabled);
    }

    case C.READER_NAV: {
      const {previous, current, next} = action.payload;
      return state
        .set('queryTimestamp', now())
        .set('previous', previous)
        .set('current', current)
        .set('next', next);
    }
  }

  return state;
}

