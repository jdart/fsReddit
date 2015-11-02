
import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React, {PropTypes} from 'react';
import {Link, History} from 'react-router';
import queryString from 'query-string';

export default class Oauth extends Component {

  static propTypes = {
    msg: PropTypes.object
  }

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
    const {msg: {home: msg}} = this.props;

    return (
      <DocumentTitle title={msg.title}>
        <div></div>
      </DocumentTitle>
    );
  }

}

