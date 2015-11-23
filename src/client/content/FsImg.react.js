
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import css from './FsImg.styl'

export default class FsImg extends Component {

  static propTypes = {
    url: PropTypes.string,
  }

  onload(e) {
    if (this.props.onload)
      this.props.onload(e);
    const img = e.target;
    const tall = (img.height / img.width) > 2;
    this.setState({tall});
  }

  render() {
    if (!this.props.url)
      return (<div/>);

    const tall = this.state && this.state.tall;
    const style = tall
      ? {maxWidth: '100%'}
      : {maxWidth: '100%', maxHeight: '100%'};
    const className = tall
      ? "fs-img fs-img-tall"
      : "fs-img";
    return (
      <div className={className}>
        <img
          style={style}
          src={this.props.url}
          onLoad={this.onload.bind(this)}
        />
      </div>
    );
  }

}
