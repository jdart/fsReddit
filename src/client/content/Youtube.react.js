
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import getYouTubeID from 'get-youtube-id';
import './Youtube.styl';


export default class Youtube extends Component {

  static propTypes = {
    url: PropTypes.string,
  }

  render() {
    if (!this.props.url)
      return (<div/>);
    const id = getYouTubeID(this.props.url);
    return (
      <div className="youtube-aligner">
        <iframe
          allowFullScreen
          className="youtube"
          frameBorder="0"
          src={`https://www.youtube.com/embed/${id}?autoplay=1`}
        />
      </div>
    );
  }

}
