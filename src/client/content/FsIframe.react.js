
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import url from 'url';
import './FsIframe.styl';
import {hostMatch} from '../utils';
import Reddit from './reddit/Reddit.react';
import Loader from '../ui/Loader.react';

export default class FsIframe extends Component {

  static propTypes = {
    actions: PropTypes.object,
    entry: PropTypes.object.isRequired,
    url: PropTypes.string.isRequired,
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  componentWillMount() {
    this.timers = {};
    this.scrollToTop();
  }

  componentWillUpdate(nextProps) {
    if (this.props.url !== nextProps.url)
      this.scrollToTop();
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
      'facebook.com',
      'msn.com',
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
          <a href={this.props.url} target="BLANK">{this.props.url}</a>
        </p>
        <Reddit {...this.props} entry={this.props.entry} url={this.props.url} />
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
        <div className="help">
          <p>
            Taking a long time? This site ({ host }) might be blocking you.
          </p>
          <p>
            Click the "<i className="fa fa-sign-out"/>" icon on the sidebar to open the original site in a new tab.
          </p>
        </div>
        <iframe
          onLoad={this.loaded.bind(this)}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          src={this.props.url}
        />
        {loaded ? '' : (<Loader />)}
      </div>
    );
  }

}
