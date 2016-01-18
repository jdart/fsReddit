
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';

export default class CustomSubreddit extends Component {

  static propTypes = {
    reddit: PropTypes.object,
    history: PropTypes.object,
  }

  go(event) {
    event.preventDefault();
    this.props.history.pushState(null, '/r/' + event.target[0].value + '/hot');
  }

  render() {
    return (
      <form className="custom-subreddit" onSubmit={this.go.bind(this)}>
        <input placeholder="Other subreddit" name="name" type="text" />
        <button type="submit">Go</button>
      </form>
    );
  }

}

