
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import Loader from '../ui/Loader.react';
import './Readability.styl';

export default class Readability extends Component {

  static propTypes = {
    actions: PropTypes.object,
    readability: PropTypes.object,
    url: PropTypes.string,
  }

  componentDidMount() {
    this.fetch();
  }

  componentDidUpdate() {
    this.fetch();
  }

  getQuery() {
    return this.props.readability
      .queries
      .get(this.props.url);
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
      this.props.actions.readability.fetch(this.props.url);
  }

  render() {
    const data = this.getData();
    if (!data)
      return (<Loader />);
    return (
      <div className="readability">
        <h1>{data.title}</h1>
        <h2>{data.author}</h2>
        <div
          className="readability-body"
          dangerouslySetInnerHTML={{__html: data.content}}
        />
      </div>
    );
  }

}
