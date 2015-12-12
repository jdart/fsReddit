
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import Loader from '../ui/Loader.react';
import url from 'url';
import css from './Streamable.styl';

export default class Streamable extends Component {

  static propTypes = {
    url: PropTypes.string,
    streamable: PropTypes.object,
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
      this.props.actions.streamableFetch(this.getId());
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
    const id = this.getId();
    if (!src)
      return (<Loader />);
    return (
      <div className="streamable-aligner">
        <video
          id={`streamable-${id}`}
          className="streamable"
          autoPlay="true"
          loop="true"
          src={src}
          preload="auto"
        />
      </div>
    );
  }

}
