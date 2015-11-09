
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import Loader from '../ui/Loader.react';
import url from 'url';
import css from './Gfycat.styl';

export default class Gfycat extends Component {

  static propTypes = {
    url: PropTypes.string,
    gfycat: PropTypes.object,
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
    return this.props.gfycat
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
      this.props.actions.gfycatFetch(this.getId());
  }

  parseId(input) {
    const parts = url.parse(input);
    const pathParts = parts.pathname.split('/');
    return pathParts.pop();
  }

  render() {
    const data = this.getData();
    const id = this.getId();
    if (!data)
      return (<Loader />);
    return (
      <div className="gfycat-aligner">
        <video
          id={`gfycat-${id}`}
          className="gfycat"
          autoPlay="true"
          loop="true"
          poster={`//thumbs.gfycat.com/${id}-poster.jpg`}
          src={data.webmUrl}
          preload="auto"
        />
      </div>
    );
  }

}
