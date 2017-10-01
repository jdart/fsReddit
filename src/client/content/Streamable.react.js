
import Component from 'react-pure-render/component';
import PropTypes from 'prop-types';
import React from 'react';
import Loader from '../ui/Loader.react';
import url from 'url';
import Video from './Video.react';

export default class Streamable extends Component {

  static propTypes = {
    actions: PropTypes.object,
    streamable: PropTypes.object,
    url: PropTypes.string,
  }

  componentDidMount() {
    this.fetch();
  }

  componentDidUpdate() {
    this.fetch();
  }

  getId() {
    return this.parseId(this.props.url);
  }

  getQuery() {
    return this.props.streamable
      .queries
      .get(this.getId());
  }

  getData() {
    const query = this.getQuery();
    if (!query)
      return;
    return query.get('data');
  }

  fetch() {
    const query = this.getQuery();
    if (!query || query.get('fetching') === null)
      this.props.actions.streamable.fetch(this.getId());
  }

  parseId(input) {
    const parts = url.parse(input);
    const pathParts = parts.pathname.split('/');
    return pathParts.pop();
  }

  getSrc() {
    const data = this.getData();
    if (!data || !Object.keys(data).length)
      return null;
    if (data['webm'])
      return data.webm.url;
    if (data['mp4'])
      return data.mp4.url;
    return data[Object.keys(data)[0]].url;
  }

  render() {
    const src = this.getSrc();
    if (!src)
      return (<Loader />);
    return (
      <Video url={src} />
    );
  }

}
