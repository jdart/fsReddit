
import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import Subreddits from '../subreddits/Subreddits.react';
import css from './Home.styl';

export default class Home extends Component {

  static propTypes = {
    reddit: PropTypes.object,
  }

  render() {
    const title = "Fullscreenit";
    return (
      <DocumentTitle title={title}>
        <div className="home-page">
          <div className="home-page-content">
            <h1>{title}</h1>
            <p>Browse reddit with an emphasis on the original content. Support for imgur galleries, youtube, gfycat and more is included.</p>
            <p>Pick a subreddit and use your keyboard's arrow keys to navigate posts.</p>
          </div>
          <Subreddits {...this.props} />
        </div>
      </DocumentTitle>
    );
  }

}

