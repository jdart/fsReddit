
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import Loader from '../ui/Loader.react';
import css from './Subreddits.styl';
import Login from '../home/Login.react';
import CustomSubreddit from './CustomSubreddit.react';

export default class Subreddits extends Component {

  static propTypes = {
    reddit: PropTypes.object,
    history: PropTypes.object,
    actions: PropTypes.object,
  }

  componentDidUpdate() {
    this.fetch();
  }

  componentDidMount() {
    this.fetch();
  }

  renderLogin() {
    if (this.props.reddit.user.get('authenticated'))
      return;
    return (
      <Login {...this.props} />
    );
  }

  fetch() {
    if (!this.empty())
      return;
    this.props.actions.redditFetchSubreddits(
      this.props.reddit.get('api')
    );
  }

  empty() {
    return this.props.reddit.subreddits.get('fetching') === null;
  }

  render() {
    const {actions} = this.props;
    if (this.empty())
      return (<Loader />);
    return (
      <ul className="home-subreddits">
        <li className="extras">
          {this.renderLogin()}
          <CustomSubreddit {...this.props} />
        </li>
        <li key="frontpage">
          <Link to="/f/hot">
            Frontpage
          </Link>
        </li>
        {this.props.reddit.subreddits.list.valueSeq().map((subreddit) => (
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

