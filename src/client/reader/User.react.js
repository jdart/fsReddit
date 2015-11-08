
import Component from 'react-pure-render/component';
import Subreddit from './Subreddit.react';
import DocumentTitle from 'react-document-title';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import Reader from './Reader.react';

export default class User extends Subreddit {

  url() {
    const { params } = this.props;
    return '/user/' + params.name + '/submitted';
  }

}
