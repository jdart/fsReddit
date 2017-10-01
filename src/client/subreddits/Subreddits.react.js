
import Component from 'react-pure-render/component';
import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router';
import Loader from '../ui/Loader.react';
import './Subreddits.styl';
import Login from '../home/Login.react';
import CustomSubreddit from './CustomSubreddit.react';

export default class Subreddits extends Component {

  static propTypes = {
    actions: PropTypes.object,
    history: PropTypes.object,
    redditUser: PropTypes.object,
  }

  componentWillReceiveProps(nextProps) {
    this.fetch(
      nextProps,
      nextProps.redditUser.authenticated !== this.props.redditUser.authenticated
    );
  }

  componentWillMount() {
    this.fetch(this.props);
  }

  renderLogin() {
    if (this.props.redditUser.authenticated)
      return;
    return (
      <Login {...this.props} />
    );
  }

  fetch(props, force = false) {
    if (!force && !this.empty(props))
      return;
    props.actions.redditUser.fetchSubreddits(
      props.redditUser.api
    );
  }

  empty(props) {
    return props.redditUser.subreddits.fetching === null;
  }

  renderUpvoted() {
    if (!this.props.redditUser.authenticated)
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
    const {redditUser: {subreddits}} = this.props;
    if (this.empty(this.props) || subreddits.fetching)
      return (<Loader />);

    if (subreddits.failed)
      return (
        <ul className="home-subreddits error">
          <li>Failed to get subreddits, try refreshing the page.</li>
        </ul>
      );

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

