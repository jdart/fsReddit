
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import Comments from './Comments.react';
import url from 'url';
import './Reddit.styl';

export default class Reddit extends Component {

  static propTypes = {
    actions: PropTypes.object,
    entry: PropTypes.object
  }

  render() {
    const {entry} = this.props;
    const {host} = url.parse(entry.url);

    return (
      <div className="reddit">
        <hgroup>
          <h2>{entry.title}</h2>
          <h4><Link className="reddit-author icon-title" to={`/u/${entry.author}`}>
            <i className="fa fa-user" />{entry.author}
          </Link></h4>
        </hgroup>
        <div className="reddit-body">
          {entry.selftext_html
            ? <div dangerouslySetInnerHTML={{__html: entry.selftext_html}} />
            : <a href={entry.url} target="_blank">
                <i className="fa fa-sign-out" />
                {host}
              </a>
          }
        </div>
        <div className="reddit-comments-root">
          <Comments {...this.props} entry={entry} />
        </div>
      </div>
    );
  }

}
