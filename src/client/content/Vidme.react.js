
import Component from 'react-pure-render/component';
import PropTypes from 'prop-types';
import React from 'react';
import Loader from '../ui/Loader.react';
import Video from './Video.react';

export default class Gfycat extends Component {

  static propTypes = {
    actions: PropTypes.object,
    url: PropTypes.string,
    vidme: PropTypes.object,
  }

  componentDidMount() {
    this.fetch();
  }

  componentDidUpdate() {
    this.fetch();
  }

  getQuery() {
    return this.props.vidme
      .queries
      .get(this.props.url);
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
      this.props.actions.vidme.fetch(this.props.url);
  }

  render() {
    const data = this.getData();
    if (!data)
      return (<Loader />);
    return (
      <Video
        url={data.complete_url}
      />
    );
  }

}
