
import {Component} from 'react';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {hostMatch} from '../utils';
import {Keys} from 'react-keydown';
import url from 'url';
import C from '../../common/reddit/content/consts';
import './Nav.styl';

export default class Nav extends Component {

  static propTypes = {
    actions: PropTypes.object,
    api: PropTypes.func,
    entry: PropTypes.object,
    reader: PropTypes.object,
    redditContent: PropTypes.object.isRequired,
    redditUser: PropTypes.object,
    secondaryNavComponent: PropTypes.func,
  }

  keyboardHandler(event) {
    const key = event.which;
    const {RIGHT, LEFT, d, a, c} = Keys;
    const contains = (matches, toMatch) => matches.indexOf(toMatch) > -1;
    const {nav} = this.props.actions.reader;
    if (contains([RIGHT, d], key))
      nav(1);
    else if (contains([LEFT, a], key))
      nav(-1);
    else if (c === key)
      this.toggleCommentMode();
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
    const action = () => this.props.actions.reader.nav(offset);
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
      this.entryByKey('current').url
    );
  }

  entryByKey(key) {
    const id = this.props.reader[key];
    return this.props.redditContent.entries.get(id);
  }

  renderTitle(entry) {
    if (this.isRedditDotCom())
      return;
    return (
      <h2>{entry.title}</h2>
    );
  }

  notifyFailedVote() {
    const {flash: {enqueue}} = this.props.actions;
    return () =>
      enqueue('Failed to vote, post might be too old.', 'error');
  }

  renderVote(entry) {
    if (!this.props.redditUser.authenticated)
      return;
    const {vote} = this.props.actions.redditUser;
    const onClickVote = () => vote(
      this.props.api,
      entry,
      this.notifyFailedVote()
    );
    const icon = entry.likes ? 'arrow-circle-up' : 'arrow-circle-o-up';
    const title = entry.likes ? 'Unvote' : 'Upvote';
    return (
      <a href="#" onClick={onClickVote}>
        <i className={`fa fa-${icon}`} />
        <span>{title}</span>
      </a>
    );
  }

  commentMode() {
    return this.props.entry.viewMode === C.REDDIT_CONTENT_VIEW_MODE_COMMENTS;
  }

  toggleCommentMode(e) {
    const {contentViewMode} = this.props.actions.redditContent;
    const {entry} = this.props;
    const nextMode = this.commentMode()
      ? C.REDDIT_CONTENT_VIEW_MODE_CONTENT
      : C.REDDIT_CONTENT_VIEW_MODE_COMMENTS;
    if (e)
      e.preventDefault();
    contentViewMode(entry.id, nextMode);
  }

  renderCommentLink(entry) {
    if (this.isRedditDotCom())
      return;
    return (
      <a href="#" onClick={this.toggleCommentMode.bind(this)}>
        <i className="fa fa-commenting" />
        {this.commentMode() ? 'Content' : 'Comments'}
      </a>
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

    const friend = () => this.props.actions.redditUser.friend(
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

  renderContextTitle() {
    return (
      <h3 className="context">
        <i className="fa fa-location-arrow" />
        {this.props.reader.query.replace(/^\//, '')}
      </h3>
    );
  }

  render() {
    const current = this.props.entry;
    const next = this.entryByKey('next');
    const previous = this.entryByKey('previous');
    const renderLink = this.renderLink.bind(this);

    return (
      <div className="reader-nav">
        <div className="fixer">
          {this.renderContextTitle.bind(this)()}
          <div className="padded">
            <div className="bg">
              {this.renderTitle.bind(this)(current)}
              <div className="icon-title">
                <Link to={`/r/${current.subreddit}`}>
                  <i className="fa fa-reddit" />
                  {current.subreddit}
                </Link>
                <div className="author">
                  <Link to={`/u/${current.author}`}>
                    <i className="fa fa-user" />
                    {current.author}
                  </Link>
                  {this.renderFollow.bind(this)(current)}
                </div>
                {this.renderVote.bind(this)(current)}
                {this.renderCommentLink.bind(this)(current)}
                {this.renderOpenInTab.bind(this)(current)}
              </div>
              <div className="icon-title nav-horiz">
                {renderLink('right', 1, next)}
                {renderLink('left', -1, previous, true)}
              </div>
              <div className="icon-title">
                <Link to="/"><i className="fa fa-home"/>Home</Link>
                <a href="#" onClick={this.toggleFullScreen}>
                  <i className="fa fa-expand" /><span>Fullscreen</span>
                </a>
              </div>
              {this.renderSecondaryNav()}
            </div>
            <div className="bottom-content">
              <div className="legend">
                <h4>Keyboard Navigation</h4>
                <ul>
                  <li><h5>Reddit Posts</h5></li>
                  <li>
                    <div className="key"><i className="fa fa-arrow-right" /></div>
                    {' / '}
                    <div className="key">D</div>
                    <span className="title">Next</span>
                  </li>
                  <li>
                    <div className="key"><i className="fa fa-arrow-left" /></div>
                    {' / '}
                    <div className="key">A</div>
                    <span className="title">Previous</span>
                  </li>
                  <li>
                    <div className="key">C</div>
                    <span className="title">Comments</span>
                  </li>
                </ul>
                <ul>
                  <li><h5>Imgur Galleries</h5></li>
                  <li>
                    <div className="key"><i className="fa fa-arrow-down" /></div>
                    {' / '}
                    <div className="key">S</div>
                    <span className="title">Next</span>
                  </li>
                  <li>
                    <div className="key"><i className="fa fa-arrow-up" /></div>
                    {' / '}
                    <div className="key">W</div>
                    <span className="title">Previous</span>
                  </li>
                </ul>
              </div>
              <div className="bugs">
                <a href="https://github.com/jdart/fsReddit/issues/new">
                  <i className="fa fa-bug" />
                  {' '}Report a bug
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
