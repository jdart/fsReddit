
import C from './consts';
import _ from 'lodash';
import {Record, List, Map} from 'immutable';
import {Query} from './types';

const InitialState = Record({
  entries: new Map,
  queries: new Map,
});
const initialState = new InitialState;
const revive = () => initialState;

function pickBestSrc(data) {
  if (data.gifv)
    return data.gifv;
  return data.link;
}

export default function imgurReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return revive();

  switch (action.type) {

    case C.IMGUR_FETCH_PENDING: {
      const reqid = action.payload.reqid;
      return state.update('queries', queries =>
        queries.set(action.payload.reqid, new Query({isFetching: true}))
      );
    }

    case C.IMGUR_FETCH_SUCCESS: {
      const reqid = action.payload.reqid;
      const response = action.payload;
      return state.update('queries', queries =>
        queries.update(reqid, query => query
          .set('isFetching', false)
          .update('entries', entries => {
            if (response.data.images)
              return entries.push(... response.data.images.map(pickBestSrc));
            return entries.push(pickBestSrc(response.data));
          })
        )
      )
    }

    case C.IMGUR_FETCH_ERROR: {
      debugger;
    }

    case C.IMGUR_STEP: {
      const reqid = action.payload.reqid;
      return state.update('queries', queries =>
        queries.update(reqid, query => query.set('index', action.payload.index))
      );
    }
  }

  return state;
}
