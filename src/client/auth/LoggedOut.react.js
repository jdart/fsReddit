
import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React, {PropTypes} from 'react';
import {Link, History} from 'react-router';

export default class LoggedOut extends Component {

  static propTypes = {
    reddit: PropTypes.object,
    history: PropTypes.object,
  }

  loggedOut(props) {
    return props.redditUser.authenticated;
  }

  goHome() {
    if (window.location.path !== '/')
      this.props.history.pushState(null, '/');
  }

  componentWillMount() {
    if (this.loggedOut(this.props))
      this.goHome();
  }

  componentWillReceiveProps(nextProps) {
    if (this.loggedOut(this.props))
      this.goHome();
  }

  render() {
    return (<div/>);
  }

}

