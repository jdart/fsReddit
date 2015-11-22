
import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React, {PropTypes} from 'react';
import Subreddit from './Subreddit.react';
import {Link} from 'react-router';
import Content from '../content/Content.react';
import Nav from './Nav.react';
import {urlParse, hostMatch} from '../utils';
import Loader from '../ui/Loader.react';
import css from './Reader.styl';

export default class Reader extends Component {

  static propTypes = {
    reddit: PropTypes.object,
    actions: PropTypes.object,
    entries: PropTypes.object,
    history: PropTypes.object,
    comments: PropTypes.bool,
  }

  image(entry) {
    const url = entry.get('url');
    const {pathname} = urlParse(url);

    return pathname.match(/\.(jpg|jpeg|png|gif)$/)
      || hostMatch('imgur.com', url);
  }

  preRender(entry) {
    if (!entry || !this.image(entry))
      return;

    return (
      <div className="reader-preloader">
        <Content {...this.props} preloading={true} entry={entry} />
      </div>
    );
  }

  render() {
    const {current, next} = this.props.entries;

    if (!current.entry)
      return (<Loader />);

    return (
      <div className="reader">
        <Nav
          {...this.props}
          entries={this.props.entries}
          api={this.props.reddit.get('api')}
        />
        <Content
          {...this.props}
          entry={current.entry}
          preloading={false}
          comments={this.props.comments}
        />
        {this.preRender(next.entry)}
      </div>
    );
  }

}
