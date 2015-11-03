
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import Comments from './Comments.react';

export default class FsIframe extends Component {

  static propTypes = {
    msg: PropTypes.object,
  }

  render() {
    return (
      <div>
        <div className="content-reddit-body" dangerouslySetInnerHTML={{__html: this.props.entry.get('selftext_html')}} />
        <Comments entry={this.props.entry} {...this.props} />
      </div>
    );
  }

}
