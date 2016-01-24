
import C from './consts';
import RC from '../reddit/content/consts';
import {includes, set, union} from 'lodash';
import {Record, List, Map} from 'immutable';
import {Query, Image} from './types';

const InitialState = Record({
  images: new Map,
  queries: new Map,
  preloadQueue: new Map({
    images: new List,
    working: false
  }),
});

export const initialState = new InitialState;
const revive = () => initialState;

function imagesArrayToKVP(data) {
  return data.reduce(
    (output, image) => set(output, image.id, new Image({
      id: image.id,
      url: image.link,
      gifv: image.gifv,
      title: image.title,
      description: image.description,
      width: image.width,
      height: image.height,
    })),
    {}
  );
}

function responseToImageArray(response) {
  if (response.status !== 200)
    return [{
      id: '404',
      link: 'http://s.imgur.com/images/404/giraffeweyes.png',
      title: null,
      description: null,
      height: null,
      width: null,
    }];

  if (response.data.images)
    return response.data.images;
  return [response.data];
}

function addToQueue(state, add) {
  const prevQueue = state.preloadQueue.get('images').toJS();
  const newQueue = union(prevQueue, add)
    .filter(key => !state.images.get(key).get('preloaded'));
  return flagPreloading(
    state.setIn(['preloadQueue', 'images'], new List(newQueue)),
    newQueue
  );
}

function flagPreloading(state, keys) {
  return state.update('images', images =>
    images.map((image, id) => {
      const oldVal = image.get('preloaded');
      if (oldVal || !includes(keys, id))
        return image;
      return image.set('preloaded', false);
    })
  );
}

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

    case RC.REDDIT_CONTENT_ENTRY_PRELOADED: {
      const {key} = action.payload.extra;
      const next = state.queries.get(key)
        .get('entries')
        .slice(0, 1).toJS();
      return addToQueue(state, next);
    }
  }

  return state;
}
