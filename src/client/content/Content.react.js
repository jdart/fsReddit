
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import Imgur from './Imgur.react';
import FsImg from './FsImg.react';
import FsIframe from './FsIframe.react';
import Reddit from './reddit/Reddit.react';
import Gfycat from './Gfycat.react';
import Instagram from './Instagram.react';
import Youtube from './Youtube.react';
import Streamable from './Streamable.react';
import Readability from './Readability.react';
import {hostMatch, urlParse} from '../utils';

export default class Content extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    entry: PropTypes.object.isRequired,
    comments: PropTypes.bool,
  }

  renderContent(entry) {
    const url = entry.get('url');
    const host = urlParse(url).host;
    if (hostMatch('reddit.com', url) || this.props.comments)
      return (<Reddit {...this.props} url={url} entry={entry} />);
    else if (url.match(/\.(jpg|jpeg|png|gif)$/))
      return (<FsImg url={url} />);
    else if (hostMatch('streamable.com', url))
      return (<Streamable url={url} />);
    else if (hostMatch('gfycat.com', url))
      return (<Gfycat {...this.props} url={url} />);
    else if (hostMatch('instagram.com', url))
      return (<Instagram {...this.props} url={url} />);
    else if (hostMatch('youtube.com', url) || hostMatch('youtu.be', url))
      return (<Youtube url={url} />);
    else if (hostMatch('imgur.com', url))
      return (<Imgur {...this.props} entry={entry} url={url} />);
    return (<FsIframe url={url} />);
    return (<Readability {...this.props} url={url} />);
  }

  render() {
    return (
      <div className="reader-content">
        {this.renderContent(this.props.entry)}
      </div>
    );
  }
}
