import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';

export default class Home extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
  }

  render() {
    return (
      <div>
        <input placeholder="URL" />
      </div>
    );
  }

}

