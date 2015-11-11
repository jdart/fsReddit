
import Component from 'react-pure-render/component';
import Subreddit from './Subreddit.react';
import DocumentTitle from 'react-document-title';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import Reader from './Reader.react';

export default class User extends Subreddit {

  generateUrl(props) {
    return '/user/' + props.params.name + '/submitted';
  }

}
