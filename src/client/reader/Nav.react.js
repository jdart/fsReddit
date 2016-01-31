
import {Component} from 'react';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {hostMatch} from '../utils';
import {Keys} from 'react-keydown';
import url from 'url';
import './Nav.styl';

export default class Nav extends Component {

  static propTypes = {
    actions: PropTypes.object,
    api: PropTypes.func,
    entry: PropTypes.object,
    reader: PropTypes.object,
    redditUser: PropTypes.object,
    secondaryNavComponent: PropTypes.func,
  }

  keyboardHandler(event) {
    const key = event.which;
    const {RIGHT, LEFT, d, a} = Keys;
    const contains = (matches, toMatch) => matches.indexOf(toMatch) > -1;
    const {readerNav} = this.props.actions;
    if (contains([RIGHT, d], key))
      readerNav(1);
    else if (contains([LEFT, a], key))
      readerNav(-1);
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

  renderLink(icon, offset, entry, truncate) {
    let className = `direction-${icon}`;
    const action = () => this.props.actions.readerNav(offset);
    if (truncate)
      className += ' truncate';
    if (!entry)
      return '';
    return (
      <p>
        <a className={className} href="#" onClick={action}>
          <i className={`fa fa-arrow-${icon}`} />
          {entry.title}
        </a>
      </p>
    );
  }

  toggleFullScreen() {
    if (!document.fullscreenElement &&    // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {  // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }

  isRedditDotCom() {
    return hostMatch(
      'reddit.com',
      this.props.reader.current.entry.url
    );
  }

  renderTitle(entry) {
    if (this.isRedditDotCom())
      return;
    return (
      <h2>{entry.title}</h2>
    );
  }

  renderVote(entry) {
    if (!this.props.redditUser.authenticated)
      return;
    const {redditVote} = this.props.actions;
    const vote = () => redditVote(this.props.api, entry);
    const icon = entry.likes ? 'arrow-circle-up' : 'arrow-circle-o-up';
    const title = entry.likes ? 'Unvote' : 'Upvote';
    return (
      <a href="#" onClick={vote}>
        <i className={`fa fa-${icon}`} />
        <span>{title}</span>
      </a>
    );
  }

  renderCommentLink(entry) {
    if (this.isRedditDotCom())
      return;
    return (
      <Link to={`/c/${entry.id}`}>
        <i className="fa fa-commenting" />
        Comments
      </Link>
    );
  }

  renderOpenInTab(entry) {
    if (this.isRedditDotCom())
      return;
    return (
      <a href={entry.url} target="_blank">
        <i className="fa fa-sign-out" />
        {url.parse(entry.url).host}
      </a>
    );
  }

  renderFollow(entry) {
    if (!this.props.redditUser.authenticated)
      return;

    const friend = () => this.props.actions.redditFriend(
      this.props.api,
      entry.author
    );

    return (
      <a href="#" onClick={friend}>
        <i className="fa fa-eye" />
        <span>
          Follow{entry.author_followed
          ? (<span>ed<i className="fa fa-check"/></span>)
          : ''}
        </span>
      </a>
    );
  }

  renderSecondaryNav() {
    const NavComponent = this.props.secondaryNavComponent;
    if (!NavComponent)
      return;
    return (
      <NavComponent
        {...this.props}
        url={this.props.entry.url}
      />
    );
  }

  render() {
    const {current, previous, next} = this.props.reader;
    const renderLink = this.renderLink.bind(this);

    return (
      <div className="reader-nav">
        {this.renderTitle.bind(this)(current.entry)}
        <div className="icon-title">
          <Link to={`/r/${current.entry.subreddit}`}>
            <i className="fa fa-reddit" />
            {current.entry.subreddit}
          </Link>
          <div className="author">
            <Link to={`/u/${current.entry.author}`}>
              <i className="fa fa-user" />
              {current.entry.author}
            </Link>
            {this.renderFollow.bind(this)(current.entry)}
          </div>
          {this.renderVote.bind(this)(current.entry)}
          {this.renderCommentLink.bind(this)(current.entry)}
          {this.renderOpenInTab.bind(this)(current.entry)}
        </div>
        <div className="icon-title nav-horiz">
          {renderLink('right', 1, next.entry)}
          {renderLink('left', -1, previous.entry, true)}
        </div>
        <div className="icon-title">
          <Link to="/"><i className="fa fa-home"/>Home</Link>
          <a href="#" onClick={this.toggleFullScreen}>
            <i className="fa fa-expand" /><span>Fullscreen</span>
          </a>
        </div>
        {this.renderSecondaryNav()}
      </div>
    );
  }

}
