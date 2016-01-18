
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import Comment from './Comment.react';
import Loader from '../../ui/Loader.react';

export default class Comments extends Component {

  static propTypes = {
    actions: PropTypes.object,
    reddit: PropTypes.object,
    entry: PropTypes.object,
  }

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
    const fetching = this.comments().get('fetching');
    if (fetching !== null)
      return;
    this.props.actions.redditFetchComments(
      this.props.redditUser.api,
      this.props.entry.get('id')
    );
  }

  ready() {
    const fetching = this.comments().get('fetching');
    return !fetching && fetching !== null;
  }

  render() {
    const comments = this.comments();
    if (!this.ready())
      return (<Loader />);
    return (
      <div className="reddit-comments">
        {comments.get('children').map(child =>
          <Comment key={child.data.id} data={child.data} />
        )}
      </div>
    );
  }

}
