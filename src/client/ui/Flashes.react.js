
import Component from 'react-pure-render/component';
import PropTypes from 'prop-types';
import React from 'react';

import './Flashes.styl';

export default class Flashes extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    flash: PropTypes.object.isRequired,
  }

  componentWillReceiveProps(nextProps) {
    const {active} = nextProps.actions.flash;
    nextProps.flash.queue
      .filter(flash => !flash.active)
      .map(flash => active(flash.id));
  }

  render() {
    const {queue} = this.props.flash;

    return (
      <div className="flashes">
        {queue.filter(flash => flash.active).map(flash => (
          <div
            className={'flash ' + flash.type}
            dangerouslySetInnerHTML={{__html: flash.msg}}
            key={flash.id}
          />
        ))}
      </div>
    );
  }
}
