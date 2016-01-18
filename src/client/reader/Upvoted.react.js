
import Component from 'react-pure-render/component';
import Subreddit from './Subreddit.react';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import Reader from './Reader.react';

export default class Upvoted extends Subreddit {

  generateUrl(props) {
    const name = props.redditUser.details.get('name');
    if (!name)
      return;
    return `/user/${name}/upvoted`;
  }

  fetch() {
    if (!this.url || !this.api)
      return;
    super.fetch();
  }

}
