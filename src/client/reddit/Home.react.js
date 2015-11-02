
import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import Subreddits from './Subreddits.react';
import Login from './Login.react';
import CustomSubreddit from './CustomSubreddit.react';

export default class Home extends Component {

  static propTypes = {
    msg: PropTypes.object,
    reddit: PropTypes.shape({
      authenticated: PropTypes.bool,
    }),
  }

  apiReady() {
    const store = this.props.reddit;
    return store.api && store.user.get('authenticated');
  }

  renderLogin() {
    return (
      <Login {... this.props}/>
    );
  }

  renderReady() {
    return (
      <div>
        <Subreddits {... this.props}/>
        <CustomSubreddit {... this.props}/>
      </div>
    );
  }

  render() {
    const {
      msg: {home: msg},
    } = this.props;

    return (
      <DocumentTitle title={msg.title}>
        <div className="home-page">
          {this.apiReady() ? this.renderReady() : this.renderLogin()}
        </div>
      </DocumentTitle>
    );
  }

}

