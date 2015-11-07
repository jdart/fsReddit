
import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React, {PropTypes} from 'react';
import Subreddit from './Subreddit.react';
import {Link} from 'react-router';
import Content from './content/Content.react';
import Nav from './Nav.react';
import url from 'url';

export default class Entries extends Component {

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
    const { host, pathname } = url.parse(entry.get('url'));
    if (
      !pathname.match(/\.(jpg|jpeg|png|gif)$/)
      && !host.match(/^.*(\.?)imgur\.com$/)
    ) return;
    return (
      <div className="preloader">
        <Content
          entry={entry}
          query={this.getQuery()}
          { ... this.props }
        />
      </div>
    );
  }

  render() {
    if (!this.props.reddit.user.get('authenticated'))
      this.props.history.pushState(null, '/')

    if (!this.getQuery() || !this.getQuery().entries.size)
      return (<div>Loading...</div>);

    const entry = this.getEntry();
    const next = this.getEntry(1);

    return (
      <div className="entries">
        <Nav entry={entry}
          api={this.props.reddit.get('api')}
          { ... this.props }
          next={this.navConfig(this.getEntry(1), 1)}
          prev={this.navConfig(this.getEntry(-1), -1)}
        />
        <Content
          entry={entry}
          query={this.getQuery()}
          { ... this.props }
          nav={true}
        />
        {this.preRender(next)}
      </div>
    );
  }

}
