
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import Imgur from './Imgur.react';
import FsImg from './FsImg.react';
import FsIframe from './FsIframe.react';
import Reddit from './reddit/Reddit.react';
import Gfycat from './Gfycat.react';
import Youtube from './Youtube.react';
import Streamable from './Streamable.react';
import Readability from './Readability.react';
import {hostMatch, urlParse} from '../utils';

export default class Content extends Component {

  static propTypes = {
    actions: PropTypes.object,
    entry: PropTypes.object,
  }

  renderContent(entry) {
    const url = entry.get('url');
    const host = urlParse(url).host;
    if (url.match(/\.(jpg|jpeg|png|gif)$/))
      return (<FsImg url={url} />);
    if (hostMatch('streamable.com', url))
      return (<Streamable url={url} />);
    if (hostMatch('gfycat.com', url))
      return (<Gfycat url={url} />);
    if (hostMatch('youtube.com', url))
      return (<Youtube url={url} />);
    if (hostMatch('reddit.com', url))
      return (<Reddit {...this.props} url={url} entry={entry} />);
    else if (hostMatch('imgur.com', url))
      return (<Imgur {...this.props} entry={entry} url={url} />);
    //return (<FsIframe url={url}Readability/>);
    return (<Readability {...this.props} url={url} />);
  }

  render() {
    const {entry} = this.props;
    return (
      <div className="reader-content">
        {this.renderContent.bind(this)(entry)}
      </div>
    );
  }
}
