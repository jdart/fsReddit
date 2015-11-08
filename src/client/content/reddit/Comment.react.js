
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';

export default class Comment extends Component {

  static propTypes = {
    data: PropTypes.object,
  }

  renderChildren() {
    const {replies} = this.props.data;
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
    const {data} = this.props;
    if (!data.body_html)
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
