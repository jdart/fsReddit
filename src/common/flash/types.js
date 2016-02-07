
import {Record} from 'immutable';

export const Flash = Record({
  id: null,
  msg: null,
  type: null,
  waiting: true,
  active: false,
});

