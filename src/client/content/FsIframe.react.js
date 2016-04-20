
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
    this.reset();
    this.blurCheckInterval = setInterval(this.blurCheck.bind(this), 300);
  }

  componentWillUnmount() {
    clearInterval(this.blurCheckInterval);
  }

  reset() {
    this.scrollToTop();
    this.mimeTypeActions(this.props);
    this.timers = {};
    this.blurred = false;
  }

  blurCheck() {
    if (this.blurred)
      return;

    const blur = this.refs.iframe
      && this.refs.iframe === document.activeElement;

    if (blur) {
      this.refs.iframe.blur();
      this.blurred = true;
      console.log('blurrrrred')
    }
  }

  componentWillUpdate(nextProps) {
    this.mimeTypeActions(nextProps);
    if (this.props.url !== nextProps.url) {
      this.reset();
      setTimeout(this.blur.bind(this), 2000);
    }
  }

  // See if this is really an image without the usual file extensions
  mimeTypeActions(props) {
    const {actions, entry} = props;
    if (entry && entry.mime_type === null)
      actions.redditContent.fetchMimeType(entry);
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

    this.props.actions.redditContent.iframeLoaded(
      this.props.entry,
      Date.now() - this.timers[this.props.url]
    );
  }

  tooFast() {
    const loadMs = this.props.entry.get('iframeLoadMs');
    return loadMs !== null && loadMs < 333;
  }

  forceFail() {
    this.props.actions.redditContent.iframeLoaded(
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
          ref="iframe"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          src={this.props.url}
        />
        {loaded ? '' : (<Loader />)}
      </div>
    );
  }

}
