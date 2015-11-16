
import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React, {PropTypes} from 'react';
import {Link, History} from 'react-router';
import queryString from 'query-string';

export default class Oauth extends Component {

  static propTypes = {
    actions: PropTypes.object,
    reddit: PropTypes.object,
    history: PropTypes.object,
  }

  componentDidMount() {
    this.runActions();
  }

  componentDidUpdate() {
    this.runActions();
  }

  runActions() {
    const {reddit, history} = this.props;
    const qs = queryString.parse(window.location.hash);
    if (!this.props.reddit.get('loaded'))
      return;
    if (this.props.reddit.user.oauth.fetching === null) {
      this.props.actions.redditLoginValidate(qs);
    } else if (reddit.user.get('authenticated')) {
      this.props.actions.redditLoggedIn(history);
    }
  }

  render() {
    return (
      <DocumentTitle title="Authenticate">
        <div />
      </DocumentTitle>
    );
  }

}

