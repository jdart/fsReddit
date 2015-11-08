
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import css from './Login.styl';

export default class Login extends Component {

  static propTypes = {
    reddit: PropTypes.object,
    actions: PropTypes.object,
  }

  render() {
    const login = this.props.actions.redditLogin;
    if (this.props.reddit.user.get('authenticated'))
      return (<div />);
    return (
      <div className="login">
        <button onClick={login}>Login to Reddit</button>
      </div>
    );
  }

}

