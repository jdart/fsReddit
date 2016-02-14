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
    actions: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    redditUser: PropTypes.object.isRequired,
  }

  componentWillReceiveProps(nextProps) {
    const {
      redditUser: {authenticated, oauth},
      actions: {
        redditUser: {sessionExpired},
        flash: {enqueue},
      }
    } = nextProps;
    if (!authenticated || oauth.data.expiry > Date.now())
      return;
    sessionExpired();
    enqueue(
      'Your session has expired, return to the homepage to login again.',
      'success'
    );
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
