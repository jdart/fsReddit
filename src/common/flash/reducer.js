
import C from './consts';
import {Record, List} from 'immutable';
import {Flash} from './types';

const InitialState = Record({
  queue: List(),
});
export const initialState = new InitialState;
const revive = () => initialState;

export default function flashReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return revive();

  switch (action.type) {

    case C.FLASH_ENQUEUE: {
      const {payload} = action;
      return state.update(
        'queue',
        queue => queue.push(
          Flash(payload).merge({waiting: true})
        )
      );
    }

    case C.FLASH_DONE: {
      const {id} = action.payload;
      return state.update(
        'queue',
        queue => queue.filter(flash => flash.id !== id)
      );
    }

    case C.FLASH_ACTIVE: {
      const {id} = action.payload;
      return state.update(
        'queue',
        queue => queue.map(flash =>
          flash.id === id
            ? flash.set('active', true)
            : flash
        )
      );
    }
  }

  return state;
}
