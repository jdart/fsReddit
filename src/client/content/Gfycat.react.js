
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import Loader from '../ui/Loader.react';
import url from 'url';
import './Gfycat.styl';

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
          autoPlay="true"
          className="gfycat"
          id={`gfycat-${id}`}
          loop="true"
          poster={`//thumbs.gfycat.com/${id}-poster.jpg`}
          preload="auto"
          src={data.webmUrl}
        />
      </div>
    );
  }

}
