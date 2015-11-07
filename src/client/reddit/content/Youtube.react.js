
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import url from 'url';
import getYouTubeID from 'get-youtube-id';


export default class Youtube extends Component {

  parseId(url) {
    const parts = parseUrl(url);
    const pathParts = parts.pathname.split('/');
    return pathParts.pop();
  }

  render() {
    if (!this.props.url)
      return (<div/>);
    const id = getYouTubeID(this.props.url);
    return (
      <div className="youtube-aligner">
        <iframe
          className="youtube"
          src={`https://www.youtube.com/embed/${id}`}
          frameBorder="0"
          allowFullScreen
        />
      </div>
    );
  }

}
