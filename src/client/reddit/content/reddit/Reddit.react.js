
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import Comments from './Comments.react';

export default class FsIframe extends Component {

  static propTypes = {
    msg: PropTypes.object,
  }

  render() {
    const {entry} = this.props;
    return (
      <div className="content-reddit">
        <hgroup>
          <h2>{entry.get('title')}</h2>
          <h4><Link to={`/u/${entry.get('author')}`}><i className="fa fa-user" />{entry.get('author')}</Link></h4>
        </hgroup>
        <div className="content-reddit-body" dangerouslySetInnerHTML={{__html: entry.get('selftext_html')}} />
        <Comments entry={entry} {...this.props} />
      </div>
    );
  }

}
