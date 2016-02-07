
import C from './consts';
import shortid from 'shortid';

export function enqueue(msg, type = 'error') {
  return {
    type: C.FLASH_ENQUEUE,
    payload: {
      id: shortid.generate(),
      msg,
      type,
    },
  };
}

export function done(id) {
  return {
    type: C.FLASH_DONE,
    payload: {id},
  };
}

export function active(id) {
  return ({dispatch}) => {
    setTimeout(() => dispatch(done(id)), 5000);
    return {
      type: C.FLASH_ACTIVE,
      payload: {id},
    };
  };
}

