
import C from './consts';
import RC from '../reddit/consts';
import includes from 'lodash/collection/includes';
import set from 'lodash/object/set';
import union from 'lodash/array/union';
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

const initialState = new InitialState;
const revive = () => initialState;

function imagesArrayToKVP(data) {
  return data.reduce(
    (output, image) => set(output, image.id, new Image(
      {
        id: image.id,
        url: image.link,
        gifv: image.gifv,
        title: image.title,
        description: image.description,
        width: image.width,
        height: image.height,
      }
    )),
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

function flagPreloading(state, keys) {;
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

    case C.IMGUR_IMAGE_PRELOADED: {
      return state.setIn(
        ['images', action.payload.image.get('id'), 'preloaded'],
        true
      );
    }

    case C.IMGUR_STEP: {
      const {reqid, index} = action.payload;
      const keys = state.queries.get(reqid).get('entries');
      const next = keys.slice(index + 1, index + 4);
      const curr = keys.get(index);
      if (state.preloadQueue.get('images').contains(curr)) // cancel current preloading
        state = state.updateIn(['images', curr], image => {
          if (image.preloadImg)
            image.update('preloadImg', img => {
              img.src = null;
              return img
            });
          return image.set('preloaded', true);
        });
      return addToQueue(state, next.toJS())
      .setIn(
        ['queries', action.payload.reqid, 'index'],
        action.payload.index
      );
    }

    case C.IMGUR_PRELOAD_NEXT_PENDING: {
      return state.update('preloadQueue', preloadQueue =>
        preloadQueue
          .set('working', true)
          .update('images', images =>
            images.filter(id => id !== action.payload.image.get('id'))
          )
      );
    }

    case C.IMGUR_PRELOAD_NEXT_ERROR: {}
    case C.IMGUR_PRELOAD_NEXT_SUCCESS: {
      return state.setIn(['preloadQueue', 'working'], false)
        .setIn(
          ['images', action.payload.image.get('id'), 'preloaded'],
          true
        );
    }

    case RC.REDDIT_ENTRY_PRELOADED: {
      const {index, key} = action.payload.extra;
      const next = state.queries.get(key)
        .get('entries')
        .slice(index, index+3).toJS();
      return addToQueue(state, next);
    }
  }

  return state;
}
