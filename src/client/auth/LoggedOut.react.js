
import Component from 'react-pure-render/component';
import PropTypes from 'prop-types';
import React from 'react';

export default class LoggedOut extends Component {

  static propTypes = {
    history: PropTypes.object,
    reddit: PropTypes.object,
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

