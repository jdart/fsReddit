import './App.styl';
import Component from 'react-pure-render/component';
import Flashes from '../ui/Flashes.react';
import React, {PropTypes} from 'react';
import RouterHandler from '../../common/components/RouterHandler.react';
import mapDispatchToProps from '../../common/app/mapDispatchToProps';
import mapStateToProps from '../../common/app/mapStateToProps';
import {connect} from 'react-redux';

// // logRenderTime is useful for app with huge UI to check render performance.
// import logRenderTime from '../lib/logRenderTime';

@connect(mapStateToProps, mapDispatchToProps)
// @logRenderTime
export default class App extends Component {

  static propTypes = {
    children: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    redditUser: PropTypes.object.isRequired,
  }

  render() {
    const {
      location: {pathname},
      redditUser: {loaded},
    } = this.props;

    return (
      // Pass data-pathname to allow route specific styling.
      <div className="page" data-pathname={pathname}>
        {/* Pathname enforces rerender so activeClassName is updated. */}
        {loaded ? (<RouterHandler {...this.props} />) : ''}
        <Flashes {...this.props} />
      </div>
    );
  }

}
