
import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import Subreddits from '../subreddits/Subreddits.react';

export default class Home extends Component {

  static propTypes = {
    reddit: PropTypes.object,
  }

  renderReady() {
    return (
      <div>
        <Subreddits {...this.props} />
      </div>
    );
  }

  render() {
    return (
      <DocumentTitle title="FullScreen Reddit">
        <div className="home-page">
          {this.renderReady()}
        </div>
      </DocumentTitle>
    );
  }

}

