
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {hostMatch, urlParse} from '../utils';
import contentMatcher from './matcher';

export default class Content extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    entry: PropTypes.object.isRequired,
    comments: PropTypes.bool,
  }

  renderContent(entry) {
    const ContentComponent = contentMatcher(entry, this.props);
    if (!ContentComponent)
      return;
    return (
      <ContentComponent
        {...this.props}
        entry={entry}
        url={entry.get('url')}
      />
    );
  }

  render() {
    return (
      <div className="reader-content">
        {this.renderContent(this.props.entry)}
      </div>
    );
  }
}
