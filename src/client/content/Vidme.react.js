
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import Loader from '../ui/Loader.react';
import url from 'url';
import Video from './Video.react';

export default class Gfycat extends Component {

  static propTypes = {
    actions: PropTypes.object,
    vidme: PropTypes.object,
    url: PropTypes.string,
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
