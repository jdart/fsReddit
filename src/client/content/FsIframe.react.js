
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
    url: PropTypes.string.isRequired,
    entry: PropTypes.object.isRequired,
  }

  isKnownIframeBlocker() {
    const host = url.parse(this.props.url).host;
    return [
      'github.com',
      'twitter.com',
      'facebook.com',
    ].some(blocked => hostMatch(blocked, 'http://' + host));
  }

  renderFailedIframe() {
    return (
      <div className="fsIframeFailed">
        <p>
          <span>Unable to display pages from this domain. </span>
          <a target="BLANK" href={this.props.url}>{this.props.url}</a>
        </p>
        <Reddit {...this.props} url={this.props.url} entry={this.props.entry} />
      </div>
    );
  }

  loaded() {
    if (this.props.entry.get('iframeLoadMs') !== null)
      return;
    this.props.actions.redditIframeLoaded(
      this.props.entry,
      Date.now() - this.startTime
    );
  }

  render() {
    if (this.isKnownIframeBlocker() || this.props.entry.get('iframeLoadMs') < 500)
      return this.renderFailedIframe();
    this.startTime = Date.now();
    return (
      <iframe className="fsIframe" src={this.props.url} onLoad={this.loaded.bind(this)} />
    );
  }

}
