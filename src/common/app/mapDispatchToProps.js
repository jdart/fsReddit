import * as redditContentActions from '../reddit/content/actions';
import * as redditUserActions from '../reddit/user/actions';
import * as imgurActions from '../imgur/actions';
import * as readabilityActions from '../readability/actions';
import * as gfycatActions from '../gfycat/actions';
import * as streamableActions from '../streamable/actions';
import * as readerActions from '../reader/actions';
import {Map} from 'immutable';
import {bindActionCreators} from 'redux';

const actions = [
  redditUserActions,
  redditContentActions,
  imgurActions,
  readabilityActions,
  gfycatActions,
  streamableActions,
  readerActions,
];

export default function mapDispatchToProps(dispatch) {
  const creators = Map()
    .merge(...actions)
    .filter(value => typeof value === 'function')
    .toObject();

  return {
    actions: bindActionCreators(creators, dispatch),
    dispatch
  };
}
