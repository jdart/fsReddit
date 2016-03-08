
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import Loader from '../ui/Loader.react';
import './Instagram.styl';

export default class Instagram extends Component {

  static propTypes = {
    actions: PropTypes.object,
    instagram: PropTypes.object,
    url: PropTypes.string.isRequired,
  }

  componentWillMount() {
    if (window.instgrm)
      return;
    let g = document.createElement('script');
    let s = document.getElementsByTagName('script')[0];
    g.src = 'https://platform.instagram.com/en_US/embeds.js';
    s.parentNode.insertBefore(g, s);
  }

  componentDidMount() {
    this.fetch();
    if (this.getData())
      this.execWidget();
  }

  componentDidUpdate() {
    this.fetch();
    if (this.getData())
      this.execWidget();
  }

  execWidget() {
    if (!window.instgrm)
      return setTimeout(this.execWidget.bind(this), 500);
    window.instgrm.Embeds.process();
  }

  getQuery() {
    return this.props.instagram
      .queries
      .get(this.props.url);
  }

  getData() {
    const query = this.getQuery();
    if (!query)
      return;
    return query.data;
  }

  fetch() {
    const query = this.getQuery();
    if (!query || query.fetching === null)
      this.props.actions.instagram.fetch(this.props.url);
  }

  render() {
    const data = this.getData();
    if (!data)
      return (<Loader />);
    return (
      <div
        className="instagram-aligner"
        dangerouslySetInnerHTML={{__html: data.html}}
      />
    );
  }
}
