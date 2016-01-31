import {combineReducers} from 'redux';

// Note we are composing all reducers. Web, native, whatever. Of course we can
// pass platform specific reducers in configureStore, but there is no reason to
// do that, until app is really large.
import device from '../device/reducer';
import redditContent from '../reddit/content/reducer';
import redditUser from '../reddit/user/reducer';
import imgur from '../imgur/reducer';
import readability from '../readability/reducer';
import gfycat from '../gfycat/reducer';
import streamable from '../streamable/reducer';
import reader from '../reader/reducer';

const appReducer = combineReducers({
  device,
  redditUser,
  redditContent,
  imgur,
  readability,
  gfycat,
  streamable,
  reader,
});

export default appReducer;
