
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import css from './Loader.styl';

export default class FsIframe extends Component {

  render() {
    return (
      <section className="loader">
        <div className="ldr">
          <div className="ldr-blk" />
          <div className="ldr-blk an_delay" />
          <div className="ldr-blk an_delay" />
          <div className="ldr-blk" />
        </div>
      </section>
    );
  }

}
