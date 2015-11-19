
import {Record, List, Map} from 'immutable';

export const Subreddits = Record({
  fetching: false,
  didInvalidate: null,
  lastUpdated: null,
  list: new List(["all", "gadgets", "sports", "gaming", "pics", "worldnews", "videos", "AskReddit", "aww", "Music", "funny", "news", "movies", "blog", "books", "history", "food", "philosophy", "television", "Jokes", "Art", "DIY", "space", "Documentaries", "Fitness", "askscience", "nottheonion", "todayilearned", "personalfinance", "gifs", "listentothis", "IAmA", "announcements", "TwoXChromosomes", "creepy", "nosleep", "GetMotivated", "WritingPrompts", "LifeProTips", "EarthPorn", "explainlikeimfive", "Showerthoughts", "Futurology", "photoshopbattles", "mildlyinteresting", "dataisbeautiful", "tifu", "OldSchoolCool", "UpliftingNews", "InternetIsBeautiful", "science"])
});

export const OauthData = Record({
  state: null,
  expires_in: null,
  access_token: null,
  scope: null,
  token_type: null,
});

export const Oauth = Record({
  fetching: null,
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
  after: null,
});

export const Comments = Record({
  fetching: null,
  children: null
});

export const Comment = Record({
  data: new Map,
  children: new List
});

