
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';

export default class FsIframe extends Component {

  static propTypes = {
    msg: PropTypes.object,
  }

  render() {
    return (
      <iframe className="fsIframe" src={this.props.url}></iframe>
    );
  }

}
