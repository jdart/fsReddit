
import C from './consts';
import RUC from '../user/consts';
import {Record, Map} from 'immutable';
import {Query, Comments} from './types';

const InitialState = Record({
  entries: new Map,
  queries: new Map,
  navActions: new Map({
    id: null,
    prev: null,
    next: null,
    first: null,
    last: null,
    up: null,
    down: null,
    title: null,
  }),
});

const initialState = new InitialState();

export default function redditReducer(state = initialState, action) {
  const {payload} = action;

  switch (action.type) {

    case C.REDDIT_CONTENT_FETCH_ENTRIES_PENDING: {
      if (payload.after)
        return state.setIn(
          ['queries', payload.url, 'fetching'],
          true
        );

      return state.setIn(
        ['queries', payload.url],
        new Query({fetching: true})
      );
    }

    case C.REDDIT_CONTENT_FETCH_ENTRIES_SUCCESS: {
      const key = payload.url;
      const data = payload.data;

      if (payload.error)
        return state
          .setIn(['queries', key, 'fetching'], false)
          .setIn(['queries', key, 'failed'], true);

      return state.updateIn(['queries', key], query =>
        query
          .merge({
            fetching: false,
            failed: false,
            index: payload.after ? query.get('index') : 0,
            after: data.after === null ? false : data.after,
          })
          .update('entries', entries => entries.concat(
            data.children
              .filter(entry => !entry.data.stickied)
              .map(entry => entry.data.id)
          ))
      )
      .update('entries', entries =>
        data.children.reduce((entries, child) =>
          entries.set(child.data.id, new Map(child.data)
            .merge({
              comments: new Comments,
              preloaded: false,
              iframeLoadMs: null,
            })),
          entries
        )
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
      return state.setIn(
        ['queries', action.payload.url, 'index'],
        action.payload.index
      );
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
      const iframeLoadMs = entry ? entry.get('iframeLoadMs') : null;

      return state.setIn(
        ['entries', action.payload.id],
        new Map(commentData.data.children[0].data).merge({
          comments: new Comments({
            children: entryData.data.children,
            fetching: false,
          }),
          preloaded: true,
          iframeLoadMs,
        })
      );
    }

    case RUC.REDDIT_USER_FRIEND_SUCCESS: {
      const {author} = action.payload;
      return state.update('entries', entries =>
        entries.map(entry =>
          entry.get('author') === author
          ? entry.set('author_followed', true)
          : entry
        )
      );
    }

    case RUC.REDDIT_USER_VOTE_SUCCESS: {
      return state.setIn(
        ['entries', action.payload.entry.get('id'), 'likes'],
        action.payload.dir
      );
    }

    case C.REDDIT_CONTENT_IFRAME_LOADED: {
      return state.setIn(
        ['entries', action.payload.entry.get('id'), 'iframeLoadMs'],
        action.payload.time
      );
    }

  }

  return state;
}
