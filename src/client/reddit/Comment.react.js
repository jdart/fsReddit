
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';

export default class Comment extends Component {

  static propTypes = {
    msg: PropTypes.object,
  }

  renderChildren() {
    const { replies } = this.props.data;
    if (!replies || !replies.data.children.length)
      return;
    return (
      <div className="replies">
        {replies.data.children.map(child =>
          <Comment key={child.data.id} data={child.data} />
        )}
      </div>
    );
  }

  render() {
    return (
      <div className="comment">
        <div className="body" dangerouslySetInnerHTML={{__html: this.props.data.body}} />
        {this.renderChildren()}
      </div>
    );
  }

}
