
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import Comment from './Comment.react';

export default class Comments extends Component {

  componentDidMount() {
    this.fetch();
  }
  componentDidUpdate() {
    this.fetch();
  }

  comments() {
    return this.props.entry.get('comments');
  }

  fetch() {
    const fetching = this.comments().get('isFetching');
    if (fetching !== null)
      return;
    this.props.actions.redditFetchComments(
      this.props.reddit.api,
      this.props.entry
    );
  }

  ready() {
    const fetching = this.comments().get('isFetching');
    return !fetching && fetching !== null;
  }

  render() {
    const comments = this.comments();
    if (!this.ready())
      return (<p>Loading comments...</p>);
    return (
      <div className="comments">
        {comments.get('children').map(child =>
          <Comment key={child.data.id} data={child.data} />
        )}
      </div>
    );
  }

}
