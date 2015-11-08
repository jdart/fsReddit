
import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React, {PropTypes} from 'react';
import Subreddit from './Subreddit.react';
import {Link} from 'react-router';
import Content from '../content/Content.react';
import Nav from './Nav.react';
import {urlParse, hostMatch} from '../utils';
import Loader from '../ui/Loader.react';
import css from './Reader.styl';

export default class Reader extends Component {

  static propTypes = {
    reddit: PropTypes.object,
    actions: PropTypes.object,
    query: PropTypes.object,
    url: PropTypes.string,
    history: PropTypes.object,
  }

  getQuery() {
    return this.props.query;
  }

  getEntry(offset=0) {
    const query = this.getQuery();
    const index = query.index + offset;
    if (index < 0)
      return null;
    return this.props.reddit.entries.get(query.entries.get(index));
  }

  goTo(offset) {
    this.props.actions
      .redditQueryIndex(
        this.props.url,
        this.props.query.index + offset
      );
  }

  navConfig(entry, index) {
    if (!entry)
      return { action: null, enty: null };
    return {
      action: () => this.goTo(index),
      entry: entry
    };
  }

  preRender(entry) {
    if (!entry)
      return;
    const url = entry.get('url');
    const {pathname} = urlParse(url);
    if (
      !pathname.match(/\.(jpg|jpeg|png|gif)$/)
      && !hostMatch('imgur.com', url)
    ) return;
    return (
      <div className="reader-preloader">
        <Content
          {...this.props}
          entry={entry}
          query={this.getQuery()}
        />
      </div>
    );
  }

  render() {

    if (!this.props.reddit.user.get('authenticated'))
      this.props.history.pushState(null, '/')

    if (!this.getQuery() || !this.getQuery().entries.size)
      return (<Loader />);

    const entry = this.getEntry();
    const next = this.getEntry(1);

    return (
      <div className="reader">
        <Nav
          {...this.props}
          entry={entry}
          api={this.props.reddit.get('api')}
          next={this.navConfig(this.getEntry(1), 1)}
          prev={this.navConfig(this.getEntry(-1), -1)}
        />
        <Content
          {...this.props}
          entry={entry}
          query={this.getQuery()}
          nav={true}
        />
        {this.preRender(next)}
      </div>
    );
  }

}
