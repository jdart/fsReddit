
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import './Login.styl';

export default class Login extends Component {

  static propTypes = {
    actions: PropTypes.object,
    redditUser: PropTypes.object,
  }

  render() {
    const login = this.props.actions.redditLogin;
    if (this.props.redditUser.get('authenticated'))
      return (<div />);
    return (
      <div className="login">
        <button onClick={login}>Login to Reddit</button>
      </div>
    );
  }

}

