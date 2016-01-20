
const dummyWindow = {
  location: null,
  localStorage: {
    getItem: () => null,
    setItme: () => null,
  },
};

export default (typeof window === 'undefined') ? dummyWindow : window;

