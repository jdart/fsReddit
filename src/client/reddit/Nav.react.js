
import {Component} from 'react';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';

import { Keys } from 'react-keydown';

export default class Nav extends Component {

  static propTypes = {
    msg: PropTypes.object,
  }

  goVert(direction) {
    const action = this.props.reddit.navActions.get(direction);
    if (action)
      action();
  }

  goNext() {
    if (this.props.next.action)
      this.props.next.action();
  }

  goPrev() {
    if (this.props.prev.action)
      this.props.prev.action();
  }

  componentDidMount() {
    document.addEventListener('keydown', event => {
      const key = event.which;
      if (key === Keys.RIGHT)
        this.goNext();
      else if (key === Keys.LEFT)
        this.goPrev();
      else if (key === Keys.UP)
        this.goVert('up');
      else if (key === Keys.DOWN)
        this.goVert('down');
    });
  }

  renderHorizLink(icon, config) {
    const { entry, action } = config;
    if (!entry)
      return '';
    return (
      <p>
        <a className={`direction-${icon}`} href="#" onClick={action}>
          <i className={`fa fa-arrow-${icon}`} />
          {entry.get('title')}
        </a>
      </p>
    );
  }

  toggleFullScreen() {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  }

  renderVertLink(icon, action) {
    if (!action)
      return;
    return (
      <a className={`direction-${icon}`} href="#" onClick={action}>
        <i className={`fa fa-arrow-${icon}`} />
      </a>
    );
  }

  renderVert() {
    const { navActions } = this.props.reddit;
    const up = navActions.get('up');
    const down = navActions.get('down');
    const vertLink = this.renderVertLink.bind(this);
    if (!up && !down)
      return (<div/>);
    return (
      <p>
        More:
        {vertLink('up', up)}
        {vertLink('down', down)}
      </p>
    );
  }

  render() {
    const { entry, prev, next } = this.props;
    const horizLink = this.renderHorizLink.bind(this);

    return (
      <div className="entries-nav">
        <hgroup>
          <h2>{entry.get('title')}</h2>
          <h3>{entry.get('subreddit')}</h3>
          <h4>{entry.get('author')}</h4>
        </hgroup>
        {horizLink('left', prev)}
        {horizLink('right', next)}
        {this.renderVert()}
        <Link to="/"><i className="fa fa-home"/>Home</Link>
        <p>
          <a onClick={this.toggleFullScreen} href="#">
            <i className="fa fa-expand" />Fullscreen
          </a>
        </p>
      </div>
    );
  }

}
