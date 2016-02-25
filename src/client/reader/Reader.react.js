
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import Content from '../content/Content.react';
import Nav from './Nav.react';
import './Reader.styl';
import {componentMatcher} from '../content/matcher';

export default class Reader extends Component {

  static propTypes = {
    actions: PropTypes.object,
    comments: PropTypes.bool,
    reader: PropTypes.object,
    redditContent: PropTypes.object,
    redditUser: PropTypes.object,
  }

  preRender(entry) {
    const config = componentMatcher(entry);
    if (!config.preload)
      return;

    return (
      <div className="reader-preloader">
        <Content
          {...this.props}
          contentComponent={config.component}
          entry={entry}
          preloading={true}
        />
      </div>
    );
  }

  entryByKey(key) {
    const id = this.props.reader[key];
    return this.props.redditContent.entries.get(id);
  }

  render() {
    const current = this.entryByKey('current');
    const next = this.entryByKey('next');
    const config = componentMatcher(current);

    return (
      <div className="reader">
        <Nav
          {...this.props}
          api={this.props.redditUser.api}
          entry={current}
          secondaryNavComponent={config.navComponent}
        />
        <Content
          {...this.props}
          comments={this.props.comments}
          contentComponent={config.component}
          entry={current}
          preloading={false}
        />
        {next && this.preRender(next)}
      </div>
    );
  }

}
