
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import url from 'url';
import _ from 'lodash';
import css from './FsIframe.styl';
import {hostMatch} from '../utils';
import Reddit from './reddit/Reddit.react';
import Loader from '../ui/Loader.react';

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

  wasTooFast() {
    const loadMs = this.props.entry.get('iframeLoadMs');
    return loadMs !== null && loadMs < 333;
  }

  render() {
    if (this.isKnownIframeBlocker() || this.wasTooFast())
      return this.renderFailedIframe();
    this.startTime = Date.now();
    const loaded = !!this.props.entry.get('iframeLoadMs');
    return (
      <div className="fsIframe">
        <iframe
          src={this.props.url}
          onLoad={this.loaded.bind(this)}
        />
        {loaded ? '' : (<Loader />)}
      </div>
    );
  }

}
