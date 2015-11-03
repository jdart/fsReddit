
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';

export default class FsImg extends Component {

  static propTypes = {
    msg: PropTypes.object,
  }

  render() {
    const bgStyle = {
      backgroundImage: 'url(' + this.props.url + ')'
    };
    if (!this.props.url)
      return (<div/>);
    return (
      <div className="entries-content-img" style={bgStyle} />
    );
  }

}
