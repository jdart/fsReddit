
import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import Subreddits from '../subreddits/Subreddits.react';

export default class Home extends Component {

  static propTypes = {
    reddit: PropTypes.object,
  }

  render() {
    return (
      <DocumentTitle title="FullScreen Reddit">
        <div className="home-page">
          <Subreddits {...this.props} />
        </div>
      </DocumentTitle>
    );
  }

}

