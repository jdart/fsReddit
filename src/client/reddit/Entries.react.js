
import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React, {PropTypes} from 'react';
import Subreddit from './Subreddit.react';
import {Link} from 'react-router';
import Content from './Content.react';
import Nav from './Nav.react';

export default class Entries extends Component {

  static propTypes = {
    msg: PropTypes.object,
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

  componentDidUpdate() {

    console.log('zzzz')
    if (this.getEntry(1) || this.getQuery().isFetching)
      return;
    console.log('zzzz')
    this.props.actions.redditFetchEntries(
      this.api(),
      this.url(),
      this.getEntry().get('name')
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

  render() {
    if (!this.props.reddit.user.get('authenticated'))
      this.props.history.pushState(null, '/')

    if (!this.getQuery() || !this.getQuery().entries.size)
      return (<div>Loading</div>);

    const entry = this.getEntry();

    return (
      <div className="entries">
        <Nav entry={entry}
          { ... this.props }
          next={this.navConfig(this.getEntry(1), 1)}
          prev={this.navConfig(this.getEntry(-1), -1)}></Nav>
        <Content entry={entry} query={this.getQuery()} { ... this.props }></Content>
      </div>
    );
  }

}
