
import Component from 'react-pure-render/component';
import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router';

export default class Comment extends Component {

  static propTypes = {
    data: PropTypes.object,
  }

  hasChildren() {
    const {replies} = this.props.data;
    if (!replies)
      return false;
    return replies.data.children.some(comment => !!comment.data.body_html);
  }

  renderChildren() {
    const {replies} = this.props.data;
    if (!this.hasChildren())
      return;
    return (
      <div className="replies">
        {replies.data.children.map(child =>
          <Comment data={child.data} key={child.data.id} />
        )}
      </div>
    );
  }

  render() {
    const {data} = this.props;
    if (!data.body_html || data.body_html === '<div class="md"></div>')
      return (<div/>);
    return (
      <div className="reddit-comment">
        <div className="details">
          <Link to={`/u/${data.author}`}>{data.author}</Link>
        </div>
        <div className="body" dangerouslySetInnerHTML={{__html: data.body_html}} />
        {this.renderChildren()}
      </div>
    );
  }

}
