
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';

import Readability from 'readability/Readability';

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
