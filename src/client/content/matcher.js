
import Imgur from './Imgur.react';
import FsImg from './FsImg.react';
import FsIframe from './FsIframe.react';
import Reddit from './reddit/Reddit.react';
import Gfycat from './Gfycat.react';
import Instagram from './Instagram.react';
import Youtube from './Youtube.react';
import Twitter from './Twitter.react';
import Streamable from './Streamable.react';
import Readability from './Readability.react';
import Gifv from './Gifv.react';
import {hostMatch} from '../utils';
import ImgurNav from './ImgurNav.react';
import C from '../../common/reddit/content/consts';

const matchers = [{
  test: (_, entry) => entry.viewMode === C.REDDIT_CONTENT_VIEW_MODE_COMMENTS,
  component: Reddit,
}, {
  test: (entryUrl, _) => entryUrl.match(/\.(jpg|jpeg|png|gif)$/),
  component: FsImg,
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
  host: 'imgur.com',
  component: Imgur,
  navComponent: ImgurNav,
}, {
  host: 'streamable.com',
  component: Streamable,
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

function configMatcher(entry) {
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

export function componentMatcher(entry, props) {
  const config = configMatcher(entry, props);
  return config ? config.component : false;
}

export function navComponentMatcher(entry, props) {
  const config = configMatcher(entry, props);
  return config ? config.navComponent : false;
}

