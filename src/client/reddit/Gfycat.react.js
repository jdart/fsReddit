
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {parseUrl} from '../utils';

export default class FsImg extends Component {

  static propTypes = {
    msg: PropTypes.object,
  }

  parseId(url) {
    const parts = parseUrl(url);
    const pathParts = parts.pathname.split('/');
    return pathParts.pop();
  }

  render() {
    if (!this.props.url)
      return (<div/>);
    const id = this.parseId(this.props.url);
    return (
      <div className="gfycat-aligner">
        <video className="gfycat" autoPlay="true" loop="true" poster={`//thumbs.gfycat.com/${id}-poster.jpg`}>
          <source id="webmsource" src={`//fat.gfycat.com/${id}.webm`} type="video/webm" />
          <source id="mp4source" src={`//giant.gfycat.com/${id}.mp4`} type="video/mp4" />
        </video>
      </div>
    );
  }

}
