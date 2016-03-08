
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import url from 'url';
import './Twitter.styl';

export default class Twitter extends Component {

  static propTypes = {
    url: PropTypes.string,
  }

  parseId(uri) {
    const parts = url.parse(uri);
    const pathParts = parts.pathname.split('/');
    return pathParts.pop();
  }

  componentWillMount() {
    if (window.twttr)
      return;
    let g = document.createElement('script');
    let s = document.getElementsByTagName('script')[0];
    g.src = 'http://platform.twitter.com/widgets.js';
    s.parentNode.insertBefore(g, s);
  }

  componentDidMount() {
    this.execWidget();
  }

  componentDidUpdate(prevProps) {
    console.log(prevProps);
    const changed = prevProps.url !== this.props.url;
    if (!changed)
      return;
    this.clean();
    this.execWidget();
  }

  clean() {
    const iframes = this.refs.tweet.querySelectorAll('iframe');
    if (!iframes)
      return;
    Array.prototype.slice.call(iframes).forEach(iframe =>
      iframe.parentNode.removeChild(iframe)
    );
  }

  execWidget() {
    if (!window.twttr)
      return setTimeout(this.execWidget.bind(this), 500);
    const id = this.parseId(this.props.url);
    window.twttr.widgets.createTweet(id, this.refs.tweet);
  }

  render() {
    if (!this.props.url)
      return (<div/>);
    const id = this.parseId(this.props.url);
    return (
      <div className="twitter-aligner">
        <div className="tweet" ref="tweet" />
      </div>
    );
  }

}
