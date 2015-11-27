
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import url from 'url';
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

  componentWillMount() {
    this.timers = {};
  }

  startTimer() {
    if (this.timers[this.props.url])
      return;

    this.timers[this.props.url] = Date.now();
  }

  blacklisted() {
    if (this.whitelisted())
      return false;

    const host = url.parse(this.props.url).host;
    return [
      'github.com',
      'twitter.com',
      'facebook.com',
    ].some(blocked => hostMatch(blocked, 'http://' + host));
  }

  whitelisted() {
    const host = url.parse(this.props.url).host;
    return [
      'nytimes.com',
    ].some(fastSite => hostMatch(fastSite, 'http://' + host));
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
      Date.now() - this.timers[this.props.url]
    );
  }

  tooFast() {
    const loadMs = this.props.entry.get('iframeLoadMs');
    return loadMs !== null && loadMs < 333;
  }

  forceFail() {
    this.props.actions.redditIframeLoaded(
      this.props.entry,
      1
    );
  }

  render() {
    if (this.blacklisted() || this.tooFast())
      return this.renderFailedIframe();

    const loaded = !!this.props.entry.get('iframeLoadMs');
    const host = url.parse(this.props.url).host;
    this.startTimer();
    return (
      <div className="fsIframe">
        <p className="help">
          Taking a long time? This site ({ host }) might be blocking you.
        </p>
        <p className="help">
          Click the "<i className="fa fa-sign-out"/>" icon on the sidebar to open the original site in a new tab.
        </p>
        <iframe
          src={this.props.url}
          onLoad={this.loaded.bind(this)}
        />
        {loaded ? '' : (<Loader />)}
      </div>
    );
  }

}
