import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React from 'react';

export default class NotFound extends Component {

  render() {

    return (
      <DocumentTitle title="Not Found">
        <div className="notfound-page">
          <h1>404</h1>
          <p>Not Found</p>
        </div>
      </DocumentTitle>
    );
  }

}
