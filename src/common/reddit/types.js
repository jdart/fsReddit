
import {Record, List, Map} from 'immutable';

export const Subreddits = Record({
  fetching: null,
  didInvalidate: null,
  lastUpdated: null,
  list: new List,
});

export const OauthData = Record({
  state: null,
  expires_in: null,
  access_token: null,
  scope: null,
  token_type: null,
});

export const Oauth = Record({
  fetching: true,
  didInvalidate: null,
  lastUpdated: null,
  data: new OauthData,
});

export const User = Record({
  authenticated: false,
  oauth: new Oauth,
});

export const Query = Record({
  fetching: true,
  didInvalidate: null,
  lastUpdated: null,
  failed: null,
  entries: new List,
  index: null,
});

export const Comments = Record({
  fetching: null,
  children: null
});

export const Comment = Record({
  data: new Map,
  children: new List
});

