
import window from './window';

export default {
  get: function(key, fallback) {
    return JSON.parse(window.localStorage.getItem(key)) || fallback;
  },
  set: function(key, value) {
    return window.localStorage.setItem(key, JSON.stringify(value));
  }
};

