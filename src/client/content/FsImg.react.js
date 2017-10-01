
import Component from 'react-pure-render/component';
import PropTypes from 'prop-types';
import React from 'react';
import './FsImg.styl';

export default class FsImg extends Component {

  static propTypes = {
    caption: PropTypes.string,
    onload: PropTypes.func,
    tallMode: PropTypes.bool,
    url: PropTypes.string,
  }

  tallKey() {
    return `tall_${this.props.url}`;
  }

  onload(e) {
    if (this.props.onload)
      this.props.onload(e);
    const img = e.target;
    const tall = (img.naturalHeight / img.naturalWidth) > 2;
    this.setState({[this.tallKey()]: tall});
  }

  isTall() {
    if (this.props.tallMode === false)
      return false;
    return this.state && this.state[this.tallKey()];
  }

  render() {
    if (!this.props.url)
      return (<div/>);

    const {caption} = this.props;
    const tall = this.isTall();
    const style = tall ? {} : {maxHeight: '100%'};
    const className = 'fs-img ' + (tall ? 'fs-img-tall' : '');
    return (
      <div className={className}>
        {caption
          ? (
            <div className="caption">
              <div><span>{caption}</span></div>
            </div>
          )
          : ''}
        <img
          onLoad={this.onload.bind(this)}
          src={this.props.url}
          style={style}
        />
      </div>
    );
  }

}
