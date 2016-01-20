
import Snoocore from 'snoocore';

const key = process.env.REDDIT_KEY ? process.env.REDDIT_KEY : null;
const host = (typeof window === 'undefined') ? 'localhost:8000' : window.location.host;

export default new Snoocore({
  userAgent: 'redditGallery@1.0.0',
  throttle: 300,
  oauth: {
    type: 'implicit',
    mobile: true,
    key: key,
    redirectUri: 'http://' + host + '/r/oauth',
    scope: ['identity', 'read', 'vote', 'history', 'mysubreddits', 'subscribe']
  }
});


