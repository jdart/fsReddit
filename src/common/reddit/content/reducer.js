
import C from './consts';
import RUC from '../user/consts';
import {Record, Map} from 'immutable';
import {Query} from './types';
import {min, max} from 'lodash';
import {now} from '../../utils';
import {
  setQueryNeedsMore,
  appendQueryEntriesFromResponse,
  addNewEntriesFromResponse,
} from '../utils';
import {concat} from 'lodash';

export const InitialState = Record({
  entries: Map(),
  queries: Map(),
});

const initialState = new InitialState();

export default function redditContentReducer(state = initialState, action) {
  const {payload} = action;

  switch (action.type) {

    case C.REDDIT_CONTENT_VIEW_MODE: {
      const {id, mode} = action.payload;
      return state.setIn(['entries', id, 'viewMode'], mode);
    }

    case C.REDDIT_CONTENT_FETCH_ENTRIES_PENDING: {
      const queryPath = ['queries', payload.url];
      const fetchingPath = concat(queryPath, 'fetching');

      if (!payload.after)
        state = state.setIn(queryPath, new Query());

      return state
        .setIn(fetchingPath, true)
        .updateIn(queryPath, setQueryNeedsMore);
    }

    case C.REDDIT_CONTENT_FETCH_ENTRIES_SUCCESS: {
      const key = payload.url;
      const data = payload.data;
      const queryPath = ['queries', key];
      state = state.setIn(concat(queryPath, 'lastUpdated'), now());

      if (payload.error)
        return state
          .setIn(concat(queryPath, 'fetching'), false)
          .setIn(concat(queryPath, 'failed'), true);

      return state.updateIn(queryPath, query =>
        query
          .merge({
            fetching: false,
            failed: false,
            index: payload.after ? query.index : 0,
            after: data.after === null ? false : data.after,
            needsMore: false,
          })
          .update('entries', entries =>
            appendQueryEntriesFromResponse(entries, data.children)
          )
      )
      .update('entries', entries =>
        addNewEntriesFromResponse(entries, data.children)
      );
    }

    case C.REDDIT_CONTENT_FETCH_ENTRIES_ERROR: {
      return state.update('queries', queries =>
          queries.map(query =>
            query.merge({
              fetching: false,
              failed: true,
            })
          )
      );
    }

    case C.REDDIT_CONTENT_QUERY_INDEX: {
      const {offset, url} = action.payload;
      const queryPath = ['queries', url];
      const indexPath = concat(queryPath, 'index');
      const currIndex = state.getIn(indexPath);
      const maxIndex = state.getIn(queryPath).entries.size;
      const nextIndex = max([0, min([currIndex + offset, maxIndex])]);
      return state.setIn(concat(queryPath, 'index'), nextIndex)
        .updateIn(queryPath, setQueryNeedsMore);
    }

    case C.REDDIT_CONTENT_FETCH_COMMENTS_PENDING: {
      return state.setIn(
        ['entries', action.payload.id, 'comments', 'fetching'],
        true
      );
    }

    case C.REDDIT_CONTENT_FETCH_COMMENTS_SUCCESS: {
      const entryData = action.payload[1];
      const entryPath = ['entries', action.payload.id];
      const commentsPath = concat(entryPath, 'comments');
      return state
        .setIn(concat(commentsPath, 'children'), entryData.data.children)
        .setIn(concat(commentsPath, 'fetching'), false);
    }

    case RUC.REDDIT_USER_FRIEND_SUCCESS: {
      const {author} = action.payload;
      return state.update('entries', entries =>
        entries.map(entry =>
          entry.author === author
          ? entry.set('author_followed', true)
          : entry
        )
      );
    }

    case RUC.REDDIT_USER_VOTE_SUCCESS: {
      return state.setIn(
        ['entries', action.payload.entry.id, 'likes'],
        action.payload.dir
      );
    }

    case C.REDDIT_CONTENT_IFRAME_LOADED: {
      return state.setIn(
        ['entries', action.payload.entry.id, 'iframeLoadMs'],
        action.payload.time
      );
    }

  }

  return state;
}
