
import Imgur from './Imgur.react';
import FsImg from './FsImg.react';
import FsIframe from './FsIframe.react';
import Reddit from './reddit/Reddit.react';
import Gfycat from './Gfycat.react';
import Vidme from './Vidme.react';
import Instagram from './Instagram.react';
import Youtube from './Youtube.react';
import Twitter from './Twitter.react';
import Streamable from './Streamable.react';
import Readability from './Readability.react';
import Gifv from './Gifv.react';
import {hostMatch} from '../utils';
import ImgurNav from './ImgurNav.react';
import C from '../../common/reddit/content/consts';
import {imageUrl, imageMimeTypeRegex} from '../../common/utils';

const matchers = [{
  test: (_, entry) => entry.viewMode === C.REDDIT_CONTENT_VIEW_MODE_COMMENTS,
  component: Reddit,
}, {
  host: 'imgur.com',
  component: Imgur,
  navComponent: ImgurNav,
  preload: true,
}, {
  test: (entryUrl, entry) => imageUrl(entryUrl)
    || imageMimeTypeRegex.test(entry.mime_type),
  component: FsImg,
  preload: true,
}, {
  host: 'imgur.com',
  test: (entryUrl, _) => entryUrl.match(/\.gifv$/),
  component: Gifv,
}, {
  host: 'reddit.com',
  component: Reddit,
}, {
  host: 'twitter.com',
  component: Twitter,
}, {
  host: 'streamable.com',
  component: Streamable,
}, {
  host: 'vid.me',
  component: Vidme,
}, {
  host: 'gfycat.com',
  component: Gfycat,
}, {
  host: 'instagram.com',
  component: Instagram,
}, {
  host: ['youtube.com', 'youtu.be'],
  component: Youtube,
}, {
  component: FsIframe,
}, {
  component: Readability,
}];

export function componentMatcher(entry) {
  const entryUrl = entry.url;
  const matches = matchers
    .filter(({host}) =>
      !host || [].concat(host).some(host => hostMatch(host, entryUrl))
    )
    .filter(({test}) => !test || test(entryUrl, entry));

  return matches.length
    ? matches[0]
    : false;
}

