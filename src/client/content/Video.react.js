
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import './Video.styl';

export default class Video extends Component {

  static propTypes = {
    poster: PropTypes.string,
    url: PropTypes.string,
  }

  render() {
    return (
      <div className="video-aligner">
        <video
          autoPlay="true"
          className="video"
          loop="true"
          poster={this.props.poster || null}
          preload="auto"
          src={this.props.url}
        />
      </div>
    );
  }

}
