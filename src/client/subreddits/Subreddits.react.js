
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

  componentWillReceiveProps(nextProps) {
    this.fetch(nextProps);
  }

  componentWillMount() {
    this.fetch(this.props);
  }

  renderLogin() {
    if (this.props.redditUser.get('authenticated'))
      return;
    return (
      <Login {...this.props} />
    );
  }

  fetch(props) {
    if (!this.empty(props))
      return;
    props.actions.redditFetchSubreddits(
      props.redditUser.get('api')
    );
  }

  empty(props) {
    return props.redditUser.subreddits.get('fetching') === null;
  }

  renderUpvoted() {
    if (!this.props.redditUser.get('authenticated'))
      return;
    return (
      <li key="upvoted">
        <Link to={`/upvoted`}>
          Upvoted
        </Link>
      </li>
    );
  }

  render() {
    const {actions} = this.props;
    if (this.empty(this.props) || this.props.redditUser.subreddits.get('fetching'))
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
        {this.renderUpvoted()}
        {this.props.redditUser.subreddits.list.valueSeq().map((subreddit) => (
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

