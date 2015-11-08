
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';

export default class FsImg extends Component {

  static propTypes = {
    url: PropTypes.string,
  }

  render() {
    if (!this.props.url)
      return (<div/>);
    return (
      <div className="entries-content-img">
        <img
          style={{maxWidth: '100%', maxHeight: '100%'}}
          src={this.props.url}
        />
      </div>
    );
  }

}
