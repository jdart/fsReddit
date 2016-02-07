import reducer from '../reducer';
import C from '../consts';
import {initialState} from '../reducer';

import {
  expect,
} from '../../../../test/mochaTestHelper';

describe('Flash Reducer()', () => {
  describe('FLASH_ENQUEUE', () => {
    it('adds to empty queue, waiting defaults to true', () => {
      let state = reducer(initialState, {
        type: C.FLASH_ENQUEUE,
        payload: {
          type: 'foo',
          id: 'bar',
          msg: 'baz',
        },
      });
      expect(state.queue.size).to.eql(1);
      expect(state.queue.get(0).waiting).to.eql(true);
    });
    it('adds to populated queue', () => {
      let state = reducer(initialState, {
        type: C.FLASH_ENQUEUE,
        payload: {
          type: 'foo',
          id: 'bar',
          msg: 'baz',
        },
      });
      expect(state.queue.size).to.eql(1);
      state = reducer(state, {
        type: C.FLASH_ENQUEUE,
        payload: {
          type: 'foo',
          id: 'bar2',
          msg: 'baz',
        },
      });
      expect(state.queue.size).to.eql(2);
    });
  });
  describe('FLASH_ACTIVE', () => {
    it('sets active to true', () => {
      let state = reducer(initialState, {
        type: C.FLASH_ENQUEUE,
        payload: {
          type: 'foo',
          id: 'bar',
          msg: 'baz',
        },
      });
      expect(state.queue.get(0).active).to.eql(false);
      state = reducer(state, {
        type: C.FLASH_ACTIVE,
        payload: {id: 'bar'},
      });
      expect(state.queue.get(0).active).to.eql(true);
    });
  });
  describe('FLASH_DONE', () => {
    it('removes last flash from populated queue', () => {
      let state = reducer(initialState, {
        type: C.FLASH_ENQUEUE,
        payload: {
          type: 'foo',
          id: 'bar',
          msg: 'baz',
        },
      });
      state = reducer(state, {
        type: C.FLASH_DONE,
        payload: {
          id: 'bar',
        },
      });
      expect(state.queue.size).to.eql(0);
    });
    it('removes arbitrary flash from populated queue', () => {
      let state = reducer(initialState, {
        type: C.FLASH_ENQUEUE,
        payload: {
          type: 'foo',
          id: 'bar',
          msg: 'baz',
        },
      });
      state = reducer(initialState, {
        type: C.FLASH_ENQUEUE,
        payload: {
          type: 'foo',
          id: 'bar2',
          msg: 'baz',
        },
      });
      state = reducer(state, {
        type: C.FLASH_DONE,
        payload: {
          id: 'bar',
        },
      });
      expect(state.queue.size).to.eql(1);
      expect(state.queue.get(0).id).to.eql('bar2');
    });
    it('removes arbitrary flash from populated queue, no matter the order', () => {
      let state = reducer(initialState, {
        type: C.FLASH_ENQUEUE,
        payload: {
          type: 'foo',
          id: 'bar',
          msg: 'baz',
        },
      });
      state = reducer(state, {
        type: C.FLASH_ENQUEUE,
        payload: {
          type: 'foo',
          id: 'bar2',
          msg: 'baz',
        },
      });
      state = reducer(state, {
        type: C.FLASH_DONE,
        payload: {
          id: 'bar2',
        },
      });
      expect(state.queue.size).to.eql(1);
      expect(state.queue.get(0).id).to.eql('bar');
    });
  });
});

