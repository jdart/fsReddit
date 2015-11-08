
import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import Subreddits from '../subreddits/Subreddits.react';
import Login from './Login.react';
import CustomSubreddit from '../subreddits/CustomSubreddit.react';

export default class Home extends Component {

  static propTypes = {
    reddit: PropTypes.object,
  }

  apiReady() {
    const store = this.props.reddit;
    return store.api && store.user.get('authenticated');
  }

  renderLogin() {
    return (
      <Login {...this.props} />
    );
  }

  renderReady() {
    return (
      <div>
        <Subreddits {...this.props} />
        <CustomSubreddit {...this.props} />
      </div>
    );
  }

  render() {
    return (
      <DocumentTitle title="FullScreen Reddit">
        <div className="home-page">
          {this.apiReady() ? this.renderReady() : this.renderLogin()}
        </div>
      </DocumentTitle>
    );
  }

}

