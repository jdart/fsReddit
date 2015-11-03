
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import FsImg from './FsImg.react';
import _ from 'lodash';
import { parseUrl } from '../../utils';

export default class Entry extends Component {

  static propTypes = {
    msg: PropTypes.object,
  }

  getRequest() {
    const url = parseUrl(this.props.url);
    const album = url.pathname.match(/\/a\/([A-Za-z0-9]{4,})/);
    const solo = url.pathname.match(/\/([A-Za-z0-9]{4,})/);
    if (album)
      return 'album/' + album[1];
    return 'image/' + solo[1];
  }

  getQuery() {
    return this.props.imgur.queries.get(this.getRequest());
  }

  getNext() {
    return this.getEntry(1);
  }

  getPrev() {
    return this.getEntry(-1);
  }

  getEntry(offset=0) {
    const query = this.getQuery();
    const index = query.index + offset;
    if (index < 0 || index > query.entries.size)
      return null;
    return query.entries.get(index);
  }

  fetchEntry() {
    if (!this.getQuery())
      this.props.actions.imgurFetch(this.getRequest());
  }

  componentDidUpdate() {
    this.fetchEntry();
    this.setNav();
  }

  setNav() {
    const query = this.getQuery();
    if (!query || !query.entries.size)
      return;
    const prev = this.getPrev();
    const next = this.getNext();
    const step = this.props.actions.imgurStep;
    const index = query.index;
    const req = this.getRequest();
    const id = req + '/' + index;
    if (this.props.reddit.navActions.get('id') === id)
      return;
    this.props.actions.redditNavActions(
      id,
      prev ? (() => step(req, index - 1)) : null,
      next ? (() => step(req, index + 1)) : null
    );
  }

  componentDidMount() {
    this.fetchEntry();
    this.setNav();
  }

  componentWillUnmount() {
    this.props.actions.redditNavActions('none', null, null);
  }

  render() {
    if (!this.getQuery())
      return (<div>Loading...</div>);
    return (
      <div className="imgur">
        <FsImg url={this.getEntry()}></FsImg>
      </div>
    );
  }

}
