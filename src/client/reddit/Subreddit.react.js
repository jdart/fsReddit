
import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import Entries from './Entries.react';

export default class Subreddit extends Component {

  static fetchCount = 0;

  url() {
    const { params } = this.props;
    if (!params.name)
      return '/' + (params.sort || 'hot');
    return '/r/' + params.name + '/' + (params.sort || 'hot');
  }

  api() {
    return this.props.reddit.api;
  }

  componentDidUpdate() {
    this.fetch();
  }

  componentDidMount() {
    this.fetch();
  }

  getQuery() {
    return this.props.reddit.queries.get(this.url());
  }

  fetch() {
    const query = this.getQuery();
    const { history } = this.props;

    if (!this.apiReady())
      history.pushState(null, '/');

    if (!query) {
      this.props.actions.redditFetchEntries(this.api(), this.url());
      return;
    }

    const entries = query.get('entries');

    if (!entries)
      return;

    if (
      query
      && (query.get('index')-1) === (entries.size-2)
      && !query.get('isFetching')
    ) this.props.actions.redditFetchEntries(
        this.api(),
        this.url(),
        entries.last()
      );
  }

  apiReady() {
    const store = this.props.reddit;
    return store.api && store.user.get('authenticated');
  }

  render() {
    const {
      reddit,
      actions
    } = this.props;
    return (
      <DocumentTitle title={this.url()}>
        <Entries query={this.getQuery()} url={this.url()} { ... this.props } />
      </DocumentTitle>
    );
  }

}
