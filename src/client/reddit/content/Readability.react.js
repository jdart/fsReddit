
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import url from 'url';
import _ from 'lodash';

export default class Readability extends Component {

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
      this.props.actions.readabilityFetch(this.props.url);
  }

  render() {
    const data = this.getData();
    if (!data)
      return (<div/>);
    return (
      <div className="readability">
        <h1>{data.title}</h1>
        <h2>{data.author}</h2>
        <div
          className="body"
          dangerouslySetInnerHTML={{__html: data.content}}
        />
      </div>
    );
  }

}
