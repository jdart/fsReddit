
import Imgur from '../Imgur.react';
import Loader from '../../ui/Loader.react';
import {Map, List} from 'immutable';

import {
  expect,
  React,
  sinon,
  TestUtils
} from '../../../../test/mochaTestHelper';

describe('Imgur component', () => {
  let actions;
  let imgur;
  let redditContent;
  let url;
  let entry;
  let sandbox;

  function renderComponent() {
    return TestUtils.renderIntoDocument(
      <Imgur {...componentProps()} />
    );
  }

  function componentProps() {
    return {
      actions,
      imgur,
      redditContent,
      url,
    };
  };

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    url = 'http://imgur.com/a/ekVnf';
    entry = {};
    imgur = Map({queries: Map({})});
    actions = {
      imgurFetch: sandbox.stub().resolves({}),
      redditNavActions: sandbox.stub().resolves({}),
    };
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
      imgur = Map({
        queries: Map({
          ekVnf: Map({failed: null, fetching: true})
        }),
        images: Map({})
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
      imgur = Map({
        queries: Map({
          'ekVnf': Map({failed: true, fetching: false})
        }),
        images: Map({ })
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

  describe('after imgur request succeeds, and image not preloaded', () => {
    beforeEach(() => {
      redditContent = {
        navActions: Map({id: 'ekVnf'}),
      };
      imgur = Map({
        queries: Map({
          'ekVnf': Map({
            failed: false,
            fetching: false,
            entries: List(['abc']),
            index: 0,
          })
        }),
        images: Map({
          abc: Map({preloaded: false, id: 'abc'})
        }),
        preloadQueue: Map({images: List([])}),
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

  describe('after imgur request succeeds, and image preloaded', () => {
    beforeEach(() => {
      redditContent = {
        navActions: Map({id: 'ekVnf'}),
      };
      imgur = Map({
        queries: Map({
          'ekVnf': Map({
            failed: false,
            fetching: false,
            entries: List(['abc']),
            index: 0,
          })
        }),
        images: Map({
          abc: Map({preloaded: true, id: 'abc', url: 'http://a.com/a.jpg'})
        }),
        preloadQueue: Map({images: List([])}),
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
      } catch(e) {}
      expect(loader).not.to.exist;
    });
  });
  //it('uses children as handle content', () => {
    //const handle = TestUtils.findRenderedDOMComponentWithClass(
      //component,
      //handleClass
    //);
    //expect(handle).to.exist;
  //});

  //it('has a translated title', () => {
    //const label = TestUtils.findRenderedDOMComponentWithClass(
      //component,
      //'title'
    //);
    //expect(label.textContent).to.eql(msg.a);
  //});

  //it('has a translated subtitle', () => {
    //const label = TestUtils.findRenderedDOMComponentWithClass(
      //component,
      //'subtitle'
    //);
    //expect(label.textContent).to.eql(msg.b);
  //});

  //describe('className', () => {
    //describe('set', () => {
      //beforeEach(() => {
        //className = 'clazz';
        //component = renderComponent();
      //});

      //it('uses the given class name', () => {
        //const root = TestUtils.findRenderedDOMComponentWithClass(
          //component,
          //className
        //);
        //expect(root).to.exist;
      //});
    //});

    //describe('default', () => {
      //beforeEach(() => {
        //className = null;
        //component = renderComponent();
      //});

      //it('uses the default class name', () => {
        //const root = TestUtils.findRenderedDOMComponentWithClass(
          //component,
          //'selector-slider'
        //);
        //expect(root).to.exist;
      //});
    //});
  //});
});
