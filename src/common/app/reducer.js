import {combineReducers} from 'redux';

// Note we are composing all reducers. Web, native, whatever. Of course we can
// pass platform specific reducers in configureStore, but there is no reason to
// do that, until app is really large.
import device from '../device/reducer';
import reddit from '../reddit/reducer';
import imgur from '../imgur/reducer';

const appReducer = combineReducers({
  device,
  reddit,
  imgur
});

export default appReducer;
