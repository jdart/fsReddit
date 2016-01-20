
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import './FsImg.styl';

export default class FsImg extends Component {

  static propTypes = {
    onload: PropTypes.func,
    tallMode: PropTypes.bool,
    url: PropTypes.string,
  }

  onload(e) {
    if (this.props.onload)
      this.props.onload(e);
    const img = e.target;
    const tall = (img.height / img.width) > 2;
    this.setState({tall});
  }

  isTall() {
    if (this.props.tallMode === false)
      return false;
    return this.state && this.state.tall;
  }

  render() {
    if (!this.props.url)
      return (<div/>);

    const tall = this.isTall();
    const style = tall ? {} : {maxHeight: '100%'};
    const className = 'fs-img ' + (tall ? 'fs-img-tall' : '');
    return (
      <div className={className}>
        <img
          onLoad={this.onload.bind(this)}
          src={this.props.url}
          style={style}
        />
      </div>
    );
  }

}
