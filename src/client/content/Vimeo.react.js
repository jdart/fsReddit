
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import Loader from '../ui/Loader.react';

import './Vimeo.styl';

export default class Vimeo extends Component {

  static propTypes = {
    actions: PropTypes.object,
    url: PropTypes.string,
    vimeo: PropTypes.object,
  }

  componentDidMount() {
    this.fetch();
  }

  componentDidUpdate() {
    this.fetch();
  }

  getQuery() {
    return this.props.vimeo
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
      this.props.actions.vimeo.fetch(this.props.url);
  }

  render() {
    const data = this.getData();
    if (!data)
      return (<Loader />);
    return (
      <div
        className="vimeo-aligner"
        dangerouslySetInnerHTML={{__html: data.html}}
      />
    );
  }

}
