
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import url from 'url';
import './Instagram.styl';

export default class Instagram extends Component {

  static propTypes = {
    url: PropTypes.string.isRequired,
  }

  id() {
    const parts = url.parse(this.props.url);
    const pathParts = parts.pathname.split('/');
    return pathParts[2];
  }

  src() {
    return 'http://api.instagram.com/p/' + this.id() + '/media/?size=l';
  }

  render() {
    return (
      <div className="instagram-aligner">
        <img src={this.src()} />
      </div>
    );
  }

}
