import reducer from '../reducer';
import C from '../consts';
import {Map, List} from 'immutable';
import {initialState} from '../reducer';

import {
  expect,
} from '../../../../test/mochaTestHelper';

describe('Imgur Reducer()', () => {

  describe('actions', () => {
    describe('IMGUR_FETCH', () => {
      it('adds to empty images map', () => {
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
      it('adds to existing images map', () => {
        const url = 'http://s.imgur.com/good.png';
        let state = initialState.mergeIn(['images'], {bcd: {url: 'foo'}});
        state = reducer(state, {
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
        expect(state.getIn(['images', 'bcd', 'url'])).to.eql('foo');
      });
      it('sets the fetching property on queries', () => {
        const url = 'http://s.imgur.com/good.png';
        let state = initialState.mergeIn(['images'], {bcd: {url: 'foo'}});
        state = reducer(state, {
          type: C.IMGUR_FETCH_PENDING,
          payload: {reqid: 'abc'}
        });
        expect(state.getIn(['queries', 'abc', 'fetching'])).to.equal(true);
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
        expect(state.getIn(['queries', 'abc', 'fetching'])).to.equal(false);
      });
      it('sets the entries on the query', () => {
        const url = 'http://s.imgur.com/good.png';
        let state = initialState.mergeIn(['images'], {bcd: {url: 'foo'}});
        state = reducer(state, {
          type: C.IMGUR_FETCH_PENDING,
          payload: {reqid: 'abc'}
        });
        expect(state.getIn(['queries', 'abc', 'fetching'])).to.equal(true);
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
        expect(state.getIn(['queries', 'abc', 'entries']).toJS()).to.eql(['abc']);
      });
    });

    describe('IMGUR_QUEUE_ADD', () => {
      it('adds to empty queue list', () => {
        let state = reducer(initialState, {
          type: C.IMGUR_QUEUE_ADD,
          payload: {images: ['abc']}
        });
        expect(state.getIn(['preloadQueue', 'images']).toJS()).to.eql(['abc']);
      });
      it('adds to existing queue list', () => {
        let state = initialState.setIn(['preloadQueue', 'images'], List(['bcd']));
        state = reducer(state, {
          type: C.IMGUR_QUEUE_ADD,
          payload: {images: ['abc']}
        });
        expect(state.getIn(['preloadQueue', 'images']).toJS()).to.eql(['bcd', 'abc']);
      });
      it('does not modify queue if duplicate', () => {
        let state = initialState.setIn(['preloadQueue', 'images'], List(['bcd', 'abc']));
        state = reducer(state, {
          type: C.IMGUR_QUEUE_ADD,
          payload: {images: ['abc']}
        });
        expect(state.getIn(['preloadQueue', 'images']).toJS()).to.eql(['bcd', 'abc']);
      });
      it('flags image as preloading', () => {
        let state = initialState.mergeIn(['images'], {abc: {id: 'abc', preloaded: null}});
        state = reducer(state, {
          type: C.IMGUR_QUEUE_ADD,
          payload: {images: ['abc']}
        });
        expect(state.getIn(['images', 'abc', 'preloaded'])).to.eql(false);
      });
    });
    describe('IMGUR_STEP', () => {
      it('adds the next 3 images', () => {
        let state = initialState.mergeIn(['queries'], {
          abc: {index: 0, entries: ['bcd', 'cde', 'efg', 'hij', 'lmo', 'zzz']},
        });
        state = reducer(state, {
          type: C.IMGUR_STEP,
          payload: {reqid: 'abc', index: 1}
        });
        expect(state.getIn(['queries', 'abc', 'index'])).to.eql(1);
        expect(state.getIn(['preloadQueue', 'images']).toJS()).to.eql(['efg', 'hij', 'lmo']);
      });
      it('adds the next 2 images, if thats all there is', () => {
        let state = initialState.mergeIn(['queries'], {
          abc: {index: 2, entries: ['bcd', 'cde', 'efg', 'hij', 'lmo', 'zzz']},
        });
        state = reducer(state, {
          type: C.IMGUR_STEP,
          payload: {reqid: 'abc', index: 3}
        });
        expect(state.getIn(['preloadQueue', 'images']).toJS()).to.eql(['lmo', 'zzz']);
      });
    });
    describe('IMGUR_QUEUE_RUN', () => {
      describe('PENDING', () => {
        it('removes image from queue and sets it to preloaded false', () => {
          let state = initialState
            .setIn(['preloadQueue', 'images'], List(['bcd', 'abc']))
            .setIn(['preloadQueue', 'working'], false)
            .setIn(['images', 'bcd'], Map({id: 'bcd', preloaded: null}))
            .setIn(['images', 'abc'], Map({id: 'abc', preloaded: null}));
          state = reducer(state, {
            type: C.IMGUR_QUEUE_RUN_PENDING,
            payload: {image: Map({id: 'abc', preloaded: null})}
          });
          expect(state.getIn(['preloadQueue', 'images']).toJS()).to.eql(['bcd']);
          expect(state.getIn(['images', 'abc', 'preloaded'])).to.eql(false);
        });
      });
      describe('SUCCESS', () => {
        it('sets queue to working false and image to preloaded true', () => {
          let state = initialState
            .setIn(['preloadQueue', 'working'], true)
            .setIn(['images', 'abc'], Map({id: 'abc', preloaded: false}));
          state = reducer(state, {
            type: C.IMGUR_QUEUE_RUN_SUCCESS,
            payload: {image: Map({id: 'abc', preloaded: null})}
          });
          expect(state.getIn(['preloadQueue', 'working'])).to.eql(false);
          expect(state.getIn(['images', 'abc', 'preloaded'])).to.eql(true);
        });
      });
    });
  });
});

