
import {Component} from 'react';
import React, {PropTypes} from 'react';
import {Keys} from 'react-keydown';
import './SecondaryNav.styl';

export default class SecondaryNav extends Component {

  static propTypes = {
    reader: PropTypes.object,
  }

  goVert(direction) {
    const {secondaryNav} = this.props.reader;
    const {last, first} = secondaryNav;
    let action = secondaryNav[direction];
    if (!action)
      action = direction === 'up' ? last : first;
    if (action)
      action();
  }

  keyboardHandler(event) {
    const key = event.which;
    const {UP, DOWN, w, s} = Keys;
    const contains = (matches, toMatch) => matches.indexOf(toMatch) > -1;
    if (contains([UP, w], key))
      this.goVert('up');
    else if (contains([DOWN, s], key))
      this.goVert('down');
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

  renderVertLink(icon, action, title) {
    if (!action)
      return;
    return (
      <a className={`direction-${icon}`} href="#" onClick={action}>
        <i className={`fa fa-arrow-${icon}`} />
        { title ? (<span>{title}</span>) : '' }
      </a>
    );
  }

  render() {
    const {secondaryNav} = this.props.reader;
    const {up, down, title} = secondaryNav;
    const vertLink = this.renderVertLink.bind(this);
    if (!up && !down)
      return (<div />);
    if (up)
      return (
        <div className="nav-vert icon-title">
          {vertLink('up', up, title)}
          {vertLink('down', down)}
        </div>
      );
    return (
      <div className="nav-vert icon-title">
        {vertLink('up', up)}
        {vertLink('down', down, title)}
      </div>
    );
  }
}
