
import {Component} from 'react';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {hostMatch} from '../utils';
import {Keys} from 'react-keydown';
import url from 'url';
import css from './Nav.styl';

export default class Nav extends Component {

  static propTypes = {
    reddit: PropTypes.object,
    actions: PropTypes.object,
    next: PropTypes.object,
    prev: PropTypes.object,
    entry: PropTypes.object,
    api: PropTypes.func,
  }

  goVert(direction) {
    let action = this.props.redditContent.navActions.get(direction);
    if (!action)
      action = this.props.redditContent.navActions.get(
        direction === 'up' ? 'last' : 'first'
      );
    if (action)
      action();
  }

  entry(key) {
    return this.props.entries[key];
  }

  goNext() {
    this.entry('next').action();
  }

  goPrev() {
    this.entry('prev').action();
  }

  keyboardHandler(event) {
    const key = event.which;
    if (key === Keys.RIGHT)
      this.goNext();
    else if (key === Keys.LEFT)
      this.goPrev();
    else if (key === Keys.UP)
      this.goVert('up');
    else if (key === Keys.DOWN)
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

  renderHorizLink(icon, config, truncate) {
    const { entry, action } = config;
    let className = `direction-${icon}`;
    if (truncate)
      className += ' truncate';
    if (!entry)
      return '';
    return (
      <p>
        <a className={className} href="#" onClick={action}>
          <i className={`fa fa-arrow-${icon}`} />
          {entry.get('title')}
        </a>
      </p>
    );
  }

  toggleFullScreen() {
    if (!document.fullscreenElement &&    // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
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

  renderVert() {
    const {navActions} = this.props.redditContent;
    const up = navActions.get('up');
    const down = navActions.get('down');
    const title = navActions.get('title');
    const vertLink = this.renderVertLink.bind(this);
    if (!up && !down)
      return (<div/>);
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

  isRedditDotCom() {
    return hostMatch(
      'reddit.com',
      this.props.entries.current.entry.get('url')
    );
  }

  renderTitle(entry) {
    if (this.isRedditDotCom())
      return;
    return (
      <h2>{entry.get('title')}</h2>
    );
  }

  renderVote(entry) {
    if (!this.props.redditUser.get('authenticated'))
      return;
    const { redditVote } = this.props.actions;
    const vote = () => redditVote(this.props.api, entry);
    const icon = entry.get('likes') ? 'arrow-circle-up' : 'arrow-circle-o-up';
    const title = entry.get('likes') ? 'Unvote' : 'Upvote';
    return (
      <a onClick={vote} href="#">
        <i className={`fa fa-${icon}`} />
        <span>{title}</span>
      </a>
    );
  }

  renderCommentLink(entry) {
    if (this.isRedditDotCom())
      return;
    return (
      <Link to={`/c/${entry.get('id')}`}>
        <i className="fa fa-commenting" />
        Comments
      </Link>
    );
  }

  renderOpenInTab(entry) {
    if (this.isRedditDotCom())
      return;
    return (
      <a href={entry.get('url')} target="_blank">
        <i className="fa fa-sign-out" />
        {url.parse(entry.get('url')).host}
      </a>
    );
  }

  renderFollow(entry) {
    if (!this.props.redditUser.get('authenticated'))
      return;

    const friend = () => this.props.actions.redditFriend(
      this.props.api,
      entry.get('author')
    );

    return (
      <a href="#" onClick={friend}>
        <i className="fa fa-eye" />
        <span>
          Follow{entry.get('author_followed')
          ? (<span>ed<i className="fa fa-check"/></span>)
          : ''}
        </span>
      </a>
    );
  }

  render() {
    const { current, prev, next } = this.props.entries;
    const horizLink = this.renderHorizLink.bind(this);

    return (
      <div className="reader-nav">
        {this.renderTitle.bind(this)(current.entry)}
        <div className="icon-title">
          <Link to={`/r/${current.entry.get('subreddit')}`}>
            <i className="fa fa-reddit" />
            {current.entry.get('subreddit')}
          </Link>
          <div className="author">
            <Link to={`/u/${current.entry.get('author')}`}>
              <i className="fa fa-user" />
              {current.entry.get('author')}
            </Link>
            {this.renderFollow.bind(this)(current.entry)}
          </div>
          {this.renderVote.bind(this)(current.entry)}
          {this.renderCommentLink.bind(this)(current.entry)}
          {this.renderOpenInTab.bind(this)(current.entry)}
        </div>
        <div className="icon-title nav-horiz">
          {horizLink('right', next)}
          {horizLink('left', prev, true)}
        </div>
        <div className="icon-title">
          <Link to="/"><i className="fa fa-home"/>Home</Link>
          <a onClick={this.toggleFullScreen} href="#">
            <i className="fa fa-expand" /><span>Fullscreen</span>
          </a>
        </div>
        {this.renderVert()}
      </div>
    );
  }

}
