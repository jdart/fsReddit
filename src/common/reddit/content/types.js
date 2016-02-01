
import {Record, List, Map} from 'immutable';
import C from './consts';

export const Query = Record({
  fetching: true,
  didInvalidate: null,
  lastUpdated: null,
  failed: null,
  entries: new List,
  index: null,
  after: null,
  needsMore: false,
});

export const Comments = Record({
  fetching: null,
  children: null
});

export const Comment = Record({
  data: new Map,
  children: new List
});

export const Entry = Record({
  viewMode: C.REDDIT_CONTENT_VIEW_MODE_CONTENT,
  comments: Comments(),
  preloaded: null,
  iframeLoadMs: null,
  domain: null,
  banned_by: null,
  media_embed: null,
  subreddit: null,
  selftext_html: null,
  selftext: null,
  likes: null,
  suggested_sort: null,
  user_reports: null,
  secure_media: null,
  link_flair_text: null,
  id: null,
  from_kind: null,
  gilded: null,
  archived: null,
  clicked: null,
  report_reasons: null,
  author: null,
  media: null,
  score: null,
  approved_by: null,
  over_18: null,
  hidden: null,
  preview: null,
  num_comments: null,
  thumbnail: null,
  subreddit_id: null,
  hide_score: null,
  edited: null,
  link_flair_css_class: null,
  author_flair_css_class: null,
  downs: null,
  secure_media_embed: null,
  saved: null,
  removal_reason: null,
  post_hint: null,
  stickied: null,
  from: null,
  is_self: null,
  from_id: null,
  permalink: null,
  locked: null,
  name: null,
  created: null,
  url: null,
  author_flair_text: null,
  quarantine: null,
  title: null,
  created_utc: null,
  distinguished: null,
  mod_reports: null,
  visited: null,
  num_reports: null,
  ups: null
});

