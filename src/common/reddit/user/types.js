
import {Record, List, Map} from 'immutable';

const defaultSubs = List(["Art", "AskReddit", "DIY", "Documentaries", "EarthPorn", "Fitness", "Futurology", "GetMotivated", "IAmA", "InternetIsBeautiful", "Jokes", "LifeProTips", "Music", "OldSchoolCool", "Showerthoughts", "TwoXChromosomes", "UpliftingNews", "WritingPrompts", "announcements", "askscience", "aww", "blog", "books", "creepy", "dataisbeautiful", "explainlikeimfive", "food", "funny", "gadgets", "gaming", "gifs", "history", "listentothis", "mildlyinteresting", "movies", "news", "nosleep", "nottheonion", "personalfinance", "philosophy", "photoshopbattles", "pics", "science", "space", "sports", "television", "tifu", "todayilearned", "videos", "worldnews"]).unshift('all');

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

