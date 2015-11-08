
import {Component} from 'react';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {hostMatch} from '../utils';
import {Keys} from 'react-keydown';
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
    const { navActions } = this.props.reddit;
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
    return hostMatch('reddit.com', this.props.entry.get('url'));
  }

  renderTitle(entry) {
    if (this.isRedditDotCom.bind(this)())
      return;
    return (
      <h2>{entry.get('title')}</h2>
    );
  }

  renderVote(entry) {
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
      <a href={`http://www.reddit.com/${entry.get('permalink')}`}>
        <i className="fa fa-commenting" />
        Comments
      </a>
    );
  }

  render() {
    const { entry, prev, next } = this.props;
    const horizLink = this.renderHorizLink.bind(this);
    const friend = () => this.props.actions.redditFriend(this.props.api, entry.get('author'));

    return (
      <div className="reader-nav">
        {this.renderTitle.bind(this)(entry)}
        <div className="icon-title">
          <Link to={`/r/${entry.get('subreddit')}`}>
            <i className="fa fa-reddit" />
            {entry.get('subreddit')}
          </Link>
          <div className="author">
            <Link to={`/u/${entry.get('author')}`}>
              <i className="fa fa-user" />
              {entry.get('author')}
            </Link>
            <a href="#" onClick={friend}>
              <i className="fa fa-eye" />
              <span>
                Follow{entry.get('author_followed')
                ? (<span>ed<i className="fa fa-check"/></span>)
                : ''}
              </span>
            </a>
          </div>
          {this.renderVote.bind(this)(entry)}
          {this.renderCommentLink.bind(this)(entry)}
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
