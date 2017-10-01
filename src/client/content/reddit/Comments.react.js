
import Component from 'react-pure-render/component';
import PropTypes from 'prop-types';
import React from 'react';
import Comment from './Comment.react';
import Loader from '../../ui/Loader.react';

export default class Comments extends Component {

  static propTypes = {
    actions: PropTypes.object,
    entry: PropTypes.object.isRequired,
    redditUser: PropTypes.object,
  }

  componentDidMount() {
    this.fetch();
  }

  componentDidUpdate() {
    this.fetch();
  }

  comments() {
    return this.props.entry.comments;
  }

  fetch() {
    const fetching = this.comments().fetching;
    if (fetching !== null)
      return;
    this.props.actions.redditContent.fetchComments(
      this.props.redditUser.api,
      this.props.entry.id
    );
  }

  ready() {
    const fetching = this.comments().fetching;
    return !fetching && fetching !== null;
  }

  renderFailed() {
    return (
      <div className="query-failed error">
        <p>
          Failed to get entries, your session likely expired.
          Go back <a href="/"><i className="fa fa-home"/>home</a>.
        </p>
      </div>
    );
  }

  render() {
    const comments = this.comments();
    if (!this.ready())
      return (<Loader />);
    return (
      <div className="reddit-comments">
        {this.comments().failed
          ? this.renderFailed()
          : comments.children.map(child =>
            <Comment data={child.data} key={child.data.id} />
          )
        }
      </div>
    );
  }

}
