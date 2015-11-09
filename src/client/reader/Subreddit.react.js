
import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import Reader from './Reader.react';

export default class Subreddit extends Component {

  static propTypes = {
    reddit: PropTypes.object,
    actions: PropTypes.object,
    params: PropTypes.object,
    history: PropTypes.object,
  }

  url() {
    const {params} = this.props;
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
    const {history} = this.props;

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
      && entries.size > 2
      && (query.get('index')-1) === (entries.size-2)
      && !query.get('isFetching')
    ) this.props.actions.redditFetchEntries(
        this.api(),
        this.url(),
        't3_' + entries.last()
      );
  }

  apiReady() {
    const store = this.props.reddit;
    return store.api && store.user.get('authenticated');
  }

  render() {
    return (
      <DocumentTitle title={this.url()}>
        <Reader {...this.props} query={this.getQuery()} url={this.url()} />
      </DocumentTitle>
    );
  }

}
