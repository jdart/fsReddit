
import Snoocore from 'snoocore';

export default new Snoocore({
  userAgent: 'redditGallery@1.0.0',
  throttle: 300,
  oauth: {
    type: 'implicit',
    mobile: true,
    key: 'aqvghrAKQxHm7g',
    redirectUri: 'http://localhost:8000/r/oauth',
    scope: ['identity', 'read', 'vote', 'flair', 'mysubreddits']
  }
});


