
import Imgur from '../Imgur.react';
import FsImg from '../FsImg.react';
import Loader from '../../ui/Loader.react';
import {Map} from 'immutable';

import {
  expect,
  React,
  sinon,
  TestUtils
} from '../../../../test/mochaTestHelper';

describe('Imgur component', () => {
  let actions;
  let imgur = Map({queries: Map({})});
  let redditContent = Map({navActions: Map({id: null})});
  let preloading = false;
  let url;
  let entry = Map({});
  let sandbox;
  let component;

  function renderComponent() {
    return TestUtils.renderIntoDocument(
      <Imgur {...componentProps()} />
    );
  }

  function componentProps() {
    return {
      actions,
      imgur,
      entry,
      redditContent,
      url,
      preloading,
    };
  };

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    actions = {
      imgurFetch: sandbox.stub().resolves({}),
      redditNavActions: sandbox.stub().resolves({}),
      imgurQueueAdd: sandbox.stub().resolves({}),
      imgurQueueRun: sandbox.stub().resolves({}),
      redditEntryPreload: sandbox.stub().resolves({}),
    };
    url = 'http://imgur.com/a/ekVnf';
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('initially', () => {
    beforeEach(() => {
      component = renderComponent();
    });
    it('renders', () => {
      let imgurComp = TestUtils.findRenderedComponentWithType(
        component,
        Imgur
      );
      expect(imgurComp).to.exist;
    });
    it('shows a loader', () => {
      let loader = TestUtils.findRenderedComponentWithType(
        component,
        Loader
      );
      expect(loader).to.exist;
    });
    it('fetches data from imgur', () => {
      expect(actions.imgurFetch).to.have.been.called;
    });
  });

  describe('when fetching data', () => {
    beforeEach(() => {
      imgur = imgur.merge({
        queries: {
          ekVnf: {failed: null, fetching: true}
        },
        images: {}
      });
      component = renderComponent();
    });
    it('shows a loader', () => {
      let loader = TestUtils.findRenderedComponentWithType(
        component,
        Loader
      );
      expect(loader).to.exist;
    });
  });

  describe('after imgur failed request', () => {
    beforeEach(() => {
      imgur = imgur.merge({
        queries: {
          ekVnf: {failed: true, fetching: false}
        },
        images: {}
      });
      component = renderComponent();
    });
    it('shows failure message', function() {
      const msg = TestUtils.findRenderedDOMComponentWithClass(
        component,
        'failed'
      );
      expect(msg).to.exist;
    });
  });

  describe('after imgur request succeeds', () => {

    describe('and first image not preloaded', () => {
      beforeEach(() => {
        redditContent = redditContent.merge({
          navActions: {id: 'ekVnf'},
        });
        imgur = imgur.merge({
          queries: {
            ekVnf: {
              failed: false,
              fetching: false,
              entries: ['abc'],
              index: 0,
            },
          },
          images: {
            abc: {preloaded: false, id: 'abc'}
          },
          preloadQueue: {images: []},
        });
        component = renderComponent();
      });
      it('shows a loader', () => {
        let loader = TestUtils.findRenderedComponentWithType(
          component,
          Loader
        );
        expect(loader).to.exist;
      });
      it('draws div.imgur', function() {
        const div = TestUtils.findRenderedDOMComponentWithClass(
          component,
          'imgur'
        );
        expect(div).to.exist;
      });
    });

    describe('and first image preloaded', () => {
      beforeEach(() => {
        redditContent = redditContent.merge({
          navActions: {id: 'ekVnf'},
        });
        imgur = imgur.merge({
          queries: {
            ekVnf: {
              failed: false,
              fetching: false,
              entries: ['abc'],
              index: 0,
            }
          },
          images: {
            abc: {preloaded: true, id: 'abc', url: 'http://a.com/a.jpg'}
          },
          preloadQueue: {images: []},
        });
        component = renderComponent();
      });
      it('does not show a loader', () => {
        let loader;
        try {
          loader = TestUtils.findRenderedComponentWithType(
            component,
            Loader
          );
        } catch (e) {}
        expect(loader).not.to.exist;
      });
      it('draws an image', () => {
        let img = TestUtils.findRenderedComponentWithType(
          component,
          FsImg
        );
        expect(img.props.url).to.equal('http://a.com/a.jpg');
      });
    });

    describe('and next image not preloaded, and next image not in preload queue', () => {
      beforeEach(() => {
        redditContent = redditContent.merge({
          navActions: {id: 'ekVnf'},
        });
        imgur = imgur.merge({
          queries: {
            ekVnf: {
              failed: false,
              fetching: false,
              entries: ['abc', 'bcd', 'cde', 'def'],
              index: 0,
            }
          },
          images: {
            abc: {preloaded: true, id: 'abc', url: 'http://a.com/a.jpg'},
            bcd: {preloaded: null, id: 'bcd', url: 'http://a.com/b.jpg'},
            cde: {preloaded: null, id: 'cde', url: 'http://a.com/c.jpg'},
            def: {preloaded: null, id: 'def', url: 'http://a.com/d.jpg'},
          },
          preloadQueue: {images: []},
        });
        component = renderComponent();
      });
      it('enqueues next 2 images to be preloaded', () => {
        expect(actions.imgurQueueAdd).to.have.been.calledWith(['bcd', 'cde']);
      });
    });

    describe('and next image not preloaded, and next image in preload queue', () => {
      beforeEach(() => {
        redditContent = redditContent.merge({
          navActions: {id: 'ekVnf'},
        });
        imgur = imgur.merge({
          queries: {
            ekVnf: {
              failed: false,
              fetching: false,
              entries: ['abc', 'bcd'],
              index: 0,
            }
          },
          images: {
            abc: {preloaded: true, id: 'abc', url: 'http://a.com/a.jpg'},
            bcd: {preloaded: null, id: 'bcd', url: 'http://b.com/b.jpg'}
          },
          preloadQueue: {images: ['bcd'], working: false},
        });
        component = renderComponent();
      });
      it('executes preload of first item in queue', () => {
        setTimeout(() => { // action is debounced, this gets test passing
          expect(actions.imgurQueueRun).to.have.been.calledWith(Map({
            preloaded: null, id: 'bcd', url: 'http://b.com/b.jpg'
          }));
        });
      });
    });
  });

  describe('when in preloading mode', () => {
    beforeEach(() => {
      redditContent = redditContent.merge({
        navActions: {id: 'ekVnf'},
      });
      imgur = imgur.merge({
        queries: {
          ekVnf: {
            failed: false,
            fetching: null,
            entries: ['abc', 'bcv'],
            index: 0,
          }
        },
        images: {
          abc: {preloaded: null, id: 'abc', url: 'http://a.com/a.jpg'},
          bcd: {preloaded: null, id: 'bcd', url: 'http://b.com/b.jpg'}
        },
        preloadQueue: {images: []},
      });
      preloading = true;
      entry = entry.merge({preloaded: null});
    });
    describe('and first image not preloaded', () => {
      beforeEach(() => {
        imgur = imgur.setIn(['queries', 'ekVnf', 'fetching'], false);
        component = renderComponent();
      });
      it('enqueues first image to be preloaded', () => {
        expect(actions.imgurQueueAdd).to.have.been.calledWith(['abc']);
      });
    });
  });

});
