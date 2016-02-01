
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';

export default class Content extends Component {

  static propTypes = {
    contentComponent: PropTypes.func.isRequired,
    entry: PropTypes.object.isRequired,
  }

  renderContent(entry, props) {
    const ContentComponent = this.props.contentComponent;
    if (!ContentComponent)
      return;
    return (
      <ContentComponent
        {...this.props}
        entry={entry}
        url={entry.url}
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
