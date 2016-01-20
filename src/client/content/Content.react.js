
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import contentMatcher from './matcher';

export default class Content extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    comments: PropTypes.bool,
    entry: PropTypes.object.isRequired,
  }

  renderContent(entry, props) {
    const ContentComponent = contentMatcher(entry, props);
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
        {this.renderContent(this.props.entry, this.props)}
      </div>
    );
  }
}
