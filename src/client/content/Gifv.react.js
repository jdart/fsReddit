
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import Video from './Video.react';

export default class Gifv extends Component {

  static propTypes = {
    url: PropTypes.string,
  }

  getSrc() {
    return this.props.url.replace('.gifv', '.webm');
  }

  render() {
    return (
      <Video url={this.getSrc()} />
    );
  }
}
