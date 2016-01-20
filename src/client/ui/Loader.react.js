
import Component from 'react-pure-render/component';
import React from 'react';
import './Loader.styl';

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
