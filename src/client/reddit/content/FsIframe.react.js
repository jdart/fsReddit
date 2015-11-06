
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import url from 'url';
import _ from 'lodash';

export default class FsIframe extends Component {

  isKnownIframeBlocker() {
    const host = url.parse(this.props.url).host;
    return _.includes(host, [
      'github.com',
    ]);
  }

  render() {
    if (this.isKnownIframeBlocker())
      return (
        <p>
          <span>Unable to display pages from this domain. </span>
          <a target="BLANK" href={this.props.url}>{this.props.url}</a>
        </p>
      );
    return (
      <iframe className="fsIframe" src={this.props.url} />
    );
  }

}
