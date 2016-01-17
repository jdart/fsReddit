
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import url from 'url';
import css from './Twitter.styl';

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
    if (!this.executedIds)
      this.executedIds = {};
    if (window.twttr)
      return;
    var g = document.createElement('script');
    var s = document.getElementsByTagName('script')[0];
    g.src = 'http://platform.twitter.com/widgets.js';
    s.parentNode.insertBefore(g, s);
  }

  componentDidMount() {
    this.execWidget();
  }

  componentDidUpdate() {
    this.execWidget();
  }

  execWidget() {
    const id = this.parseId(this.props.url);
    if (!window.twttr)
      return setTimeout(this.execWidget.bind(this), 500);
    if (this.executedIds[id])
      return;

    this.executedIds[id] = true;
    window.twttr.widgets.createTweet(
      this.parseId(this.props.url),
      this.refs.tweet
    );
  }

  render() {
    if (!this.props.url)
      return (<div/>);
    return (
      <div className="twitter-aligner">
        <div className="tweet" ref="tweet" />
      </div>
    );
  }

}
