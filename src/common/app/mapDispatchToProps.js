
import * as redditContent from '../reddit/content/actions';
import * as redditUser from '../reddit/user/actions';
import * as imgur from '../imgur/actions';
import * as readability from '../readability/actions';
import * as gfycat from '../gfycat/actions';
import * as instagram from '../instagram/actions';
import * as streamable from '../streamable/actions';
import * as reader from '../reader/actions';
import * as flash from '../flash/actions';
import * as vidme from '../vidme/actions';
import {mapValues} from 'lodash';
import {bindActionCreators} from 'redux';

const actionCreators = {
  redditContent,
  redditUser,
  imgur,
  readability,
  gfycat,
  instagram,
  streamable,
  reader,
  flash,
  vidme,
};

export default function mapDispatchToProps(dispatch) {
  const actions = mapValues(
    actionCreators,
    creators => bindActionCreators(creators, dispatch),
  );
  return {
    actions,
    dispatch,
  };
}
