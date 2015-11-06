
import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React, {PropTypes} from 'react';
import {Link, History} from 'react-router';
import queryString from 'query-string';

export default class Oauth extends Component {

  componentDidMount() {
    const qs = queryString.parse(window.location.hash);
    this.props.actions.redditLoginValidate(qs);
  }

  componentDidUpdate() {
    const {reddit, history} = this.props;
    if (reddit.user.get('authenticated'))
      this.props.actions.redditLoggedIn(history)
  }

  render() {
    return (
      <DocumentTitle title="Authenticate">
        <div></div>
      </DocumentTitle>
    );
  }

}

