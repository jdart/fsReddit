
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
import { parseUrl } from '../../utils';

export default class Content extends Component {

  renderContent(entry) {
    const url = entry.get('url');
    const host = parseUrl(url).host;
    if (url.match(/\.(jpg|jpeg|png|gif)$/))
      return (<FsImg url={url} />);
    if (host.match(/^.*(\.?)streamable.com$/))
      return (<Streamable url={url} />);
    if (host.match(/^.*(\.?)gfycat.com$/))
      return (<Gfycat url={url} />);
    if (host.match(/^.*(\.?)youtube.com$/))
      return (<Youtube url={url} />);
    if (host.match(/^.*(\.?)reddit\.com$/))
      return (<Reddit {...this.props} url={url} entry={entry} />);
    else if (host.match(/^.*(\.?)imgur\.com$/))
      return (<Imgur {...this.props} entry={entry} url={url} />);
    //return (<FsIframe url={url}Readability/>);
    return (<Readability {...this.props} url={url} />);
  }

  render() {
    const { entry } = this.props;
    return (
      <div className="entries-content">
        {this.renderContent.bind(this)(entry)}
      </div>
    );
  }
}
