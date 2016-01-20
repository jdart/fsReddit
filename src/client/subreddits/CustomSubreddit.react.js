
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';

export default class CustomSubreddit extends Component {

  static propTypes = {
    history: PropTypes.object,
  }

  go(event) {
    event.preventDefault();
    this.props.history.pushState(null, '/r/' + event.target[0].value + '/hot');
  }

  render() {
    return (
      <form className="custom-subreddit" onSubmit={this.go.bind(this)}>
        <input name="name" placeholder="Other subreddit" type="text" />
        <button type="submit">Go</button>
      </form>
    );
  }

}

