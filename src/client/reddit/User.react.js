
import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import Entries from './Entries.react';

export default class User extends Component {

  static propTypes = {
    msg: PropTypes.object,
  }

  url() {
    const { params } = this.props;
    return '/user/' + params.name + '/submitted';
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
    if (!query)
      this.props.actions.redditFetchEntries(this.api(), this.url());
  }

  apiReady() {
    const store = this.props.reddit;
    return store.api && store.user.get('authenticated');
  }

  render() {
    const {
      msg: {home: msg},
      reddit,
      actions
    } = this.props;

    return (
      <DocumentTitle title={msg.title}>
        <Entries query={this.getQuery()} url={this.url()} { ... this.props }>
        </Entries>
      </DocumentTitle>
    );
  }

}
