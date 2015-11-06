
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';

export default class CustomSubreddit extends Component {

  go(event) {
    event.preventDefault();
    this.props.history.pushState(null, '/r/' + event.target[0].value + '/hot');
  }

  render() {
    const store = this.props.reddit;
    return (
      <form className="custom-subreddit" onSubmit={this.go.bind(this)}>
        <label htmlFor="name">Other:</label>
        <input name="name" type="text" />
        <button type="submit">Go</button>
      </form>
    );
  }

}

