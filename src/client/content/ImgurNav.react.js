
import {Component} from 'react';
import React, {PropTypes} from 'react';
import {Keys} from 'react-keydown';
import './ImgurNav.styl';
import {parse, imgurQuery} from '../../common/imgur/utils';

export default class ImgurNav extends Component {

  static propTypes = {
    actions: PropTypes.object,
    imgur: PropTypes.object,
    url: PropTypes.string,
  }

  componentWillReceiveProps(nextProps) {
    this.propsChanged(nextProps);
  }

  componentWillMount() {
    this.propsChanged(this.props);
  }

  propsChanged(props) {
    this.query = imgurQuery(props.url, props.imgur);
  }

  go(offset) {
    const {index, entries: {size}} = this.query;
    if (size === 1)
      return;

    const nextIndex = index + offset;
    const id = parse(this.props.url).id;
    const {step} = this.props.actions.imgur;
    const action = index => step(id, index);

    if (nextIndex === size)
      action(0);
    else if (nextIndex < 0)
      action(size - 1);
    else
      action(nextIndex);
  }

  keyboardHandler(event) {
    const key = event.which;
    const {UP, DOWN, w, s} = Keys;
    const contains = (matches, toMatch) => matches.indexOf(toMatch) > -1;
    if (contains([UP, w], key))
      this.go(-1);
    else if (contains([DOWN, s], key))
      this.go(1);
  }

  componentWillUnmount() {
    document.removeEventListener(
      'keydown',
      this.keyboardHandlerRef
    );
  }

  componentDidMount() {
    this.keyboardHandlerRef = this.keyboardHandler.bind(this);
    document.addEventListener(
      'keydown',
      this.keyboardHandlerRef
    );
  }

  renderLink(icon, offset, withTitle) {
    const {index, entries: {size}} = this.query;
    const nextIndex = index + offset;
    const skip = nextIndex < 0 || nextIndex === size;
    if (skip)
      return;
    const action = this.props.actions.imgur.step;
    const title = `${index + 1} / ${size}`;
    const id = parse(this.props.url).id;
    const step = () => action(id, nextIndex);
    return (
      <a className={`direction-${icon}`} href="#" onClick={step}>
        <i className={`fa fa-arrow-${icon}`} />
        { withTitle ? (<span>{title}</span>) : '' }
      </a>
    );
  }

  renderQuality() {
    const {actions, imgur} = this.props;
    const icon = imgur.hq ? 'check-square-o' : 'square-o';
    const onClick = (e) => e.preventDefault() || actions.imgur.hq();
    const {index, entries} = this.query;
    const image = imgur.images.get(entries.get(index));
    if (!image.hasMultipleQualities)
      return (<div />);
    return (
      <div className="icon-title quality">
        <a href="#" onClick={onClick}>
          <i className={`fa fa-${icon}`} />
          <span>HQ</span>
        </a>
      </div>
    );
  }

  render() {
    if (!this.query)
      return (<div />);

    const {index, entries: {size}} = this.query;
    const first = index === 0;
    const renderLink = this.renderLink.bind(this);

    if (size < 1)
      return (<div />);
    if (size < 2)
      return this.renderQuality();

    return (
      <div className="nav-vert icon-title">
        {renderLink('up', -1, !first)}
        {renderLink('down', 1, first)}
        {this.renderQuality()}
      </div>
    );
  }
}
