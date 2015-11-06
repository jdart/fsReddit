
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';

export default class Login extends Component {

  getStore() {
    return this.props.reddit;
  }

  render() {
    const login = this.props.actions.redditLogin;
    if (this.getStore().user.get('authenticated'))
      return (<div/>);
    return (
      <div className="login">
        <button onClick={login}>Login to Reddit</button>
      </div>
    );
  }

}

