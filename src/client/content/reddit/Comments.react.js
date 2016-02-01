
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
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
    this.props.actions.redditFetchComments(
      this.props.redditUser.get('api'),
      this.props.entry.id
    );
  }

  ready() {
    const fetching = this.comments().fetching;
    return !fetching && fetching !== null;
  }

  render() {
    const comments = this.comments();
    if (!this.ready())
      return (<Loader />);
    return (
      <div className="reddit-comments">
        {comments.children.map(child =>
          <Comment data={child.data} key={child.data.id} />
        )}
      </div>
    );
  }

}
