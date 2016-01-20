
import Subreddit from './Subreddit.react';

export default class User extends Subreddit {

  generateUrl(props) {
    return '/user/' + props.params.name + '/submitted';
  }

}
