
import {Record, List, Map} from 'immutable';
import {caseInsensitiveSort} from '../utils';

const defaultSubs = List(['gadgets', 'sports', 'gaming', 'pics', 'worldnews', 'videos', 'AskReddit', 'aww', 'Music', 'funny', 'news', 'movies', 'blog', 'books', 'history', 'food', 'philosophy', 'television', 'Jokes', 'Art', 'DIY', 'space', 'Documentaries', 'Fitness', 'askscience', 'nottheonion', 'todayilearned', 'personalfinance', 'gifs', 'listentothis', 'IAmA', 'announcements', 'TwoXChromosomes', 'creepy', 'nosleep', 'GetMotivated', 'WritingPrompts', 'LifeProTips', 'EarthPorn', 'explainlikeimfive', 'Showerthoughts', 'Futurology', 'photoshopbattles', 'mildlyinteresting', 'dataisbeautiful', 'tifu', 'OldSchoolCool', 'UpliftingNews', 'InternetIsBeautiful', 'science']).sort(caseInsensitiveSort).unshift('all');

export const OauthData = Record({
  state: null,
  expires_in: null,
  expiry: null,
  access_token: null,
  scope: null,
  token_type: null,
});

export const Oauth = Record({
  fetching: null,
  didInvalidate: null,
  lastUpdated: null,
  data: OauthData(),
});

export const Subreddits = Record({
  fetching: null,
  failed: null,
  list: List(),
  filtered: List(),
});

export const InitialState = Record({
  authenticated: false,
  oauth: Oauth(),
  details: Map(),
  loaded: false,
  subreddits: Subreddits(),
  api: null,
});

export const initialUnauthState = InitialState()
  .set('loaded', true)
  .setIn(['subreddits', 'list'], defaultSubs)
  .setIn(['subreddits', 'fetching'], false);

