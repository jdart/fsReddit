import reducer from '../reducer';
import C from '../consts';
import * as actions from '../actions';
import {Map, List} from 'immutable';
import {initialState} from '../reducer';

import {
  expect,
} from '../../../../test/mochaTestHelper';

describe('Imgur Reducer()', () => {

  const now =  new Date().getTime();

  describe('actions', () => {
    describe('IMGUR_FETCH', () => {
      it('adds to images map', () => {
        const url = 'http://s.imgur.com/good.png';
        let state = reducer(initialState, {
          type: C.IMGUR_FETCH_PENDING,
          payload: {reqid: 'abc'}
        });
        state = reducer(state, {
          type: C.IMGUR_FETCH_SUCCESS,
          payload: {
            status: 200,
            reqid: 'abc',
            data: {images: [{
              id: 'abc',
              link: url,
            }]}
          }
        });
        expect(state.getIn(['images', 'abc', 'url'])).to.eql(url);
      });
    });
  });
});

