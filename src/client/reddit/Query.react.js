
import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';

export default class Home extends Component {

  renderRedditStatus(reddit, actions) {
    if (reddit.authenticated)
      return;
    return (
      <button onClick={actions.redditLogin}>Login to Reddit</button>
    );
  }

  checkForReady() {
    const { reddit, actions } = this.props;
    if (reddit.authenticated && !reddit.posts.size && !reddit.fetching)
      actions.redditLoad(reddit.oauth);
  }

  componentDidUpdate() {
    this.checkForReady();
  }

  componentDidMount() {
    this.checkForReady();
  }

  renderFrontpage() {
    const { reddit: { posts }, actions } = this.props;
    return (
      <ul>
        {posts.valueSeq().map(post => (
          <li
            key={post.id}>
            <Link to={`/r/post/${post.id}`}>
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  render() {
    const {
      reddit,
      actions
    } = this.props;

    return (
      <DocumentTitle title="Foobar">
        <div className="home-page">
          { this.renderRedditStatus(reddit, actions) }
          { this.renderFrontpage() }
        </div>
      </DocumentTitle>
    );
  }

}
