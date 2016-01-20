
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import Content from '../content/Content.react';
import Nav from './Nav.react';
import {urlParse, hostMatch} from '../utils';
import Loader from '../ui/Loader.react';
import css from './Reader.styl';

export default class Reader extends Component {

  static propTypes = {
    actions: PropTypes.object,
    comments: PropTypes.bool,
    entries: PropTypes.object,
    history: PropTypes.object,
    redditUser: PropTypes.object,
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
        <Content {...this.props} entry={entry} preloading={true} />
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
          api={this.props.redditUser.get('api')}
          entries={this.props.entries}
        />
        <Content
          {...this.props}
          comments={this.props.comments}
          entry={current.entry}
          preloading={false}
        />
        {this.preRender(next.entry)}
      </div>
    );
  }

}
