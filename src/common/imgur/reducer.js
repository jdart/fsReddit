
import C from './consts';
import {Record, List, Map} from 'immutable';
import {Query} from './types';
import {imagesArrayToKVP, responseToImageArray, addToQueue} from './utils';

export const InitialState = Record({
  images: new Map,
  queries: new Map,
  preloadQueue: new Map({
    images: new List,
    working: false
  }),
  hq: true,
});

export const initialState = new InitialState;
const revive = () => initialState;

export default function imgurReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return revive();

  switch (action.type) {

    case C.IMGUR_FETCH_PENDING: {
      return state.setIn(
        ['queries', action.payload.reqid],
        new Query({fetching: true})
      );
    }

    case C.IMGUR_FETCH_SUCCESS: {
      const response = action.payload;
      const imageArray = responseToImageArray(response);
      return state.update('images', images =>
        images.merge(imagesArrayToKVP(imageArray))
      )
      .updateIn(
        ['queries', action.payload.reqid],
        query => query
          .set('fetching', false)
          .set('entries', new List(imageArray.map(image => image.id)))
      );
    }

    case C.IMGUR_FETCH_ERROR: {
      return state.setIn(
        ['queries', action.payload.reqid, 'failed'],
        true
      );
    }

    case C.IMGUR_IMAGE_CACHED: {
      return state.setIn(
        ['images', action.payload.image.get('id'), 'preloaded'],
        true
      );
    }

    case C.IMGUR_QUEUE_ADD: {
      return addToQueue(state, action.payload.images);
    }

    case C.IMGUR_STEP: {
      const {reqid, index} = action.payload;
      const keys = state.queries.get(reqid).get('entries');
      const next = keys.slice(index + 1, index + 4);
      return addToQueue(state, next.toJS())
      .setIn(
        ['queries', action.payload.reqid, 'index'],
        action.payload.index
      );
    }

    case C.IMGUR_QUEUE_RUN_PENDING: {
      const id = action.payload.image.get('id');
      return state
      .setIn(['images', id, 'preloaded'], false)
      .update('preloadQueue', preloadQueue =>
        preloadQueue
          .set('working', true)
          .update('images', images =>
            images.filter(id => id !== action.payload.image.get('id'))
          )
      );
    }

    case C.IMGUR_QUEUE_RUN_ERROR: {}
    case C.IMGUR_QUEUE_RUN_SUCCESS: {
      const id = action.payload.image.get('id');

      return state.setIn(['preloadQueue', 'working'], false)
        .setIn(['images', id, 'preloaded'], true);
    }

    case C.IMGUR_HQ: {
      return state.set('hq', !state.hq);
    }
  }

  return state;
}
