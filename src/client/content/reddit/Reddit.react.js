
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import Comments from './Comments.react';
import css from './Reddit.styl';

export default class FsIframe extends Component {

  static propTypes = {
    actions: PropTypes.object,
    entry: PropTypes.object
  }

  render() {
    const {entry} = this.props;
    return (
      <div className="reddit">
        <hgroup>
          <h2>{entry.get('title')}</h2>
          <h4><Link className="icon-title" to={`/u/${entry.get('author')}`}>
            <i className="fa fa-user" />{entry.get('author')}
          </Link></h4>
        </hgroup>
        <div
          className="reddit-body"
          dangerouslySetInnerHTML={{__html: entry.get('selftext_html')}}
        />
        <Comments {...this.props} entry={entry} />
      </div>
    );
  }

}
