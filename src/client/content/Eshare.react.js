
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {domainDecoder} from '../utils';
import url from 'url';
import basename from 'basename';

import './Eshare.styl';

export const domain = '00650072006f00730068006100720065002e0063006f006d';

export default class Eshare extends Component {

  static propTypes = {
    url: PropTypes.string,
  }

  parseId() {
    const parts = url.parse(this.props.url);
    return basename(parts.pathname);
  }

  render() {
    if (!this.props.url)
      return (<div />);
    const id = this.parseId(this.props.url);
    return (
      <div className="eshare">
        <iframe
          allowFullScreen
          frameBorder="0"
          scrolling="no"
          src={`https://${domainDecoder(domain)}/embed/${id}`}
        />
      </div>
    );
  }

}
