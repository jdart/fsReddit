
import Component from 'react-pure-render/component';
import PropTypes from 'prop-types';
import React from 'react';
import Loader from '../ui/Loader.react';
import url from 'url';
import Video from './Video.react';

export default class Gfycat extends Component {

  static propTypes = {
    actions: PropTypes.object,
    gfycat: PropTypes.object,
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
    return this.props.gfycat
      .queries
      .get(this.getId());
  }

  getData() {
    const query = this.getQuery();
    if (!query)
      return;
    return query.data;
  }

  fetch() {
    const query = this.getQuery();
    if (!query || query.fetching === null)
      this.props.actions.gfycat.fetch(this.getId());
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
      <Video
        poster={`//thumbs.gfycat.com/${id}-poster.jpg`}
        url={data.webmUrl}
      />
    );
  }

}
