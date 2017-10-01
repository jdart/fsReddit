
import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import PropTypes from 'prop-types';
import React from 'react';
import Subreddits from '../subreddits/Subreddits.react';

import './Home.styl';

export default class Home extends Component {

  static propTypes = {
    reddit: PropTypes.object,
  }

  render() {
    const title = 'Fullscreenit';
    return (
      <DocumentTitle title={title}>
        <div className="home-page padded-content">
          <div className="home-page-content">
            <h1>{title}</h1>
            <p>Browse reddit with an emphasis on the original content. Support for imgur galleries, youtube, gfycat and more is included.</p>
            <p>Pick a subreddit and use your keyboard's arrow keys to navigate posts.</p>
          </div>
          <Subreddits {...this.props} />
          <div className="bugs">
            <a href="https://github.com/jdart/fsReddit/issues/new">
              <i className="fa fa-bug" />
              {' '}Report a bug
            </a>
          </div>
        </div>
      </DocumentTitle>
    );
  }

}

