
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import './Video.styl';

export default class Video extends Component {

  static propTypes = {
    poster: PropTypes.string,
    url: PropTypes.string,
  }

  componentWillMount() {
    this.setState({error: false});
  }

  componentWillReceiveProps() {
    this.setState({error: false});
  }

  error() {
    this.setState({error: true});
  }

  render() {
    const error = this.state.error || false;
    if (error)
      return (
        <div className="error">
          Failed to play video.
        </div>
      );
    return (
      <div className="video-aligner">
        <video
          autoPlay="true"
          className="video"
          error={this.error.bind(this)}
          loop="true"
          poster={this.props.poster || null}
          preload="auto"
          src={this.props.url}
        />
      </div>
    );
  }

}
