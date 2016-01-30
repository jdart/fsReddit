
import C from './consts';
import RUC from '../user/consts';
import {Record, Map} from 'immutable';
import {Query, Entry, NavActions} from './types';
import {
  setQueryNeedsMore,
  appendQueryEntriesFromResponse,
  addNewEntriesFromResponse,
} from '../utils';
import {concat} from 'lodash';

const InitialState = Record({
  entries: Map(),
  queries: Map(),
  navActions: NavActions(),
});

const initialState = new InitialState();

export default function redditReducer(state = initialState, action) {
  const {payload} = action;

  switch (action.type) {

    case C.REDDIT_CONTENT_FETCH_ENTRIES_PENDING: {
      const queryPath = ['queries', payload.url];
      const fetchingPath = concat(queryPath, 'fetching');

      if (!payload.after)
        state = state.setIn(queryPath, new Query({fetching: true}));

      return state
        .setIn(fetchingPath, true)
        .updateIn(queryPath, setQueryNeedsMore);
    }

    case C.REDDIT_CONTENT_FETCH_ENTRIES_SUCCESS: {
      const key = payload.url;
      const data = payload.data;
      const queryPath = ['queries', key];

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
      const {index} = action.payload;
      const queryPath = ['queries', action.payload.url];
      return state.setIn(concat(queryPath, 'index'), index)
        .updateIn(queryPath, setQueryNeedsMore);
    }

    case C.REDDIT_CONTENT_NAV_ACTIONS: {
      const {prev, next, first, last, id, title} = action.payload;
      return state.mergeIn(['navActions'], {
        id,
        up: prev,
        down: next,
        first,
        last,
        title,
      });
    }

    case C.REDDIT_CONTENT_FETCH_COMMENTS_PENDING: {
      return state.setIn(
        ['entries', action.payload.id, 'comments', 'fetching'],
        true
      );
    }

    case C.REDDIT_CONTENT_FETCH_COMMENTS_SUCCESS: {
      const commentData = action.payload[0];
      const entryData = action.payload[1];
      const entry = state.entries.get(action.payload.id);
      const iframeLoadMs = entry ? entry.iframeLoadMs : null;
      const entryPath = ['entries', action.payload.id];
      const commentsPath = concat(entryPath, 'comments');
      return state
        .setIn(entryPath, Entry(commentData.data.children[0].data))
        .mergeIn(entryPath, {
          preloaded: true,
          iframeLoadMs,
        })
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
