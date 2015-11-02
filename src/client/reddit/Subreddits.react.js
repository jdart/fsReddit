
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';

export default class Subreddits extends Component {

  static propTypes = {
    msg: PropTypes.object,
    reddit: PropTypes.shape({
      authenticated: PropTypes.bool,
    }),
  }

  componentDidUpdate() {
    this.fetch();
  }

  componentDidMount() {
    this.fetch();
  }

  getStore() {
    return this.props.reddit;
  }

  fetch() {
    const store = this.getStore();
    if (!this.empty())
      return;
    this.props.actions.redditFetchSubreddits(store.get('api'));
  }

  empty() {
    return this.getStore().subreddits.get('isFetching') === null;
  }

  render() {
    const store = this.props.reddit;
    const { actions } = this.props;
    if (this.empty())
      return (<p>Loading...</p>);
    return (
      <ul className="home-subreddits">
        <li key="frontpage">
          <Link to="/f/hot">
            Frontpage
          </Link>
        </li>
        {store.subreddits.list.valueSeq().map((subreddit) => (
          <li key={subreddit}>
            <Link to={`/r/${subreddit}`}>
              {subreddit}
            </Link>
          </li>
        ))}
      </ul>
    );
  }

}

