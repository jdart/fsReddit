
import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import Reader from './Reader.react';
import Loader from '../ui/Loader.react';

export default class Subreddit extends Component {

  static propTypes = {
    reddit: PropTypes.object,
    actions: PropTypes.object,
    params: PropTypes.object,
    history: PropTypes.object,
  }

  generateUrl(props) {
    const {params} = props;
    if (!params.name)
      return '/' + (params.sort || 'hot');
    return '/r/' + params.name + '/' + (params.sort || 'hot');
  }

  shortcuts(props) {
    this.url = this.generateUrl(props);
    this.query = this.url ? props.reddit.queries.get(this.url) : null;
    this.entries = this.query ? this.query.get('entries') : null;
    this.api = props.reddit.get('api');
  }

  componentWillReceiveProps(nextProps) {
    this.shortcuts(nextProps);
    this.fetch();
  }

  componentWillMount() {
    this.shortcuts(this.props);
    this.fetch();
  }

  fetchInitial() {
    this.props.actions.redditFetchEntries(
      this.api,
      this.url
    );
  }

  fetchMore() {
    this.props.actions.redditFetchEntries(
      this.api,
      this.url,
      this.query.get('after')
    );
  }

  needMore() {
    return this.entries
      && this.entries.size > 2
      && this.query.get('after') !== false
      && (this.query.get('index')-1) === (this.entries.size-2)
      && !this.query.get('fetching');
  }

  fetch() {
    if (typeof window === 'undefined')
      return;

    if (!this.query)
      this.fetchInitial();
    else if (this.needMore())
      this.fetchMore();
  }

  getEntry(offset=0) {
    const index = this.query.index + offset;
    if (index < 0)
      return null;
    return this.props.reddit.entries.get(this.entries.get(index));
  }

  entryConfig(offset) {
    const entry = this.getEntry(offset);
    if (!entry)
      return { action: () => false, entry: null };
    return {
      action: () => this.goTo(offset),
      entry: entry
    };
  }

  entriesConfig() {
    return {
      prev: this.entryConfig(-1),
      current: this.entryConfig(0),
      next: this.entryConfig(1),
    };
  }

  goTo(offset) {
    this.props.actions.redditQueryIndex(
      this.url,
      this.query.index + offset
    );
  }

  renderFailed() {
    return (
      <div className="query-failed">
        <p>Failed to get entries, try refreshing the page.</p>
      </div>
    );
  }

  renderContent() {
    if (this.query && this.query.get('failed'))
      return this.renderFailed();

    if (!this.entries)
      return (<Loader />);

    return (
      <Reader
        {...this.props}
        entries={this.entriesConfig()}
      />
    )
  }

  render() {
    return (
      <DocumentTitle title={this.url}>
        {this.renderContent()}
      </DocumentTitle>
    );
  }

}
