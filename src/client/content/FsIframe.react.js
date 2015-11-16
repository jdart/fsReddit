
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import url from 'url';
import _ from 'lodash';
import css from './FsIframe.styl';
import {hostMatch} from '../utils';
import Reddit from './reddit/Reddit.react';

export default class FsIframe extends Component {

  static propTypes = {
    actions: PropTypes.object,
    url: PropTypes.string,
    entry: PropTypes.object,
  }

  isKnownIframeBlocker() {
    const host = url.parse(this.props.url).host;
    return [
      'github.com',
      'twitter.com',
      'facebook.com',
    ].some(blocked => hostMatch(blocked, 'http://' + host));
  }

  render() {
    if (this.isKnownIframeBlocker())
      return (
        <div>
          <p>
            <span>Unable to display pages from this domain. </span>
            <a target="BLANK" href={this.props.url}>{this.props.url}</a>
          </p>
          <Reddit {...this.props} url={this.props.url} entry={this.props.entry} />
        </div>
      );
    return (
      <iframe className="fsIframe" src={this.props.url} />
    );
  }

}
