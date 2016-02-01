
import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React, {PropTypes} from 'react';
import Reader from './Reader.react';
import Loader from '../ui/Loader.react';

export default class ReaderFetcher extends Component {

  static propTypes = {
    actions: PropTypes.object,
    reader: PropTypes.object,
    redditContent: PropTypes.object,
    redditUser: PropTypes.object,
    url: PropTypes.string,
  }

  shortcuts(props) {
    const {url, redditContent, redditUser} = props;
    this.query = redditContent.queries.get(url);
    this.entries = this.query ? this.query.get('entries') : null;
    this.api = redditUser.get('api');
  }

  componentWillReceiveProps(nextProps) {
    this.shortcuts(nextProps);
    this.runActions(nextProps);
  }

  componentWillMount() {
    this.shortcuts(this.props);
    this.runActions(this.props, true);
  }

  runActions(props, mounting) {
    if (typeof window === 'undefined')
      return;

    if (this.props.url !== props.url || mounting)
      this.props.actions.readerQuery(props.url);
    else if (!this.query)
      this.fetchInitial(props);
    else if (this.query.needsMore)
      this.fetchMore(props);
    else if (this.navStale(props))
      props.actions.readerNav(0);
  }

  navStale(props) {
    const {queryTimestamp} = props.reader;

    if (this.query.fetching !== false) // Still fetching
      return false;

    return !queryTimestamp
      || queryTimestamp < this.query.lastUpdated;
  }

  fetchInitial(props) {
    props.actions.redditFetchEntries(this.api, props.url);
  }

  fetchMore(props) {
    props.actions.redditFetchEntries(
      this.api,
      props.url,
      this.query.after
    );
  }

  renderFailed() {
    return (
      <div className="query-failed">
        <p>Failed to get entries, try refreshing the page.</p>
      </div>
    );
  }

  render() {
    if (this.query && this.query.get('failed'))
      return this.renderFailed();

    if (!this.entries || !this.props.reader.queryTimestamp)
      return (<Loader />);

    return (
      <DocumentTitle title={this.props.url}>
        <Reader
          entries={this.entries}
          query={this.query}
          {...this.props}
        />
      </DocumentTitle>
    );
  }
}
