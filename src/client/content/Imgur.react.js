
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import FsImg from './FsImg.react';
import {imgPreload, urlParse} from '../utils';
import Loader from '../ui/Loader.react';
import css from './Gfycat.styl';

export default class Imgur extends Component {

  static propTypes = {
    actions: PropTypes.object,
    url: PropTypes.string,
    imgur: PropTypes.object,
    reddit: PropTypes.object
  }

  getRequest() {
    const url = urlParse(this.props.url);
    const album = url.pathname.match(/\/a\/([A-Za-z0-9]{4,})/);
    const solo = url.pathname.match(/\/([A-Za-z0-9]{4,})/);
    if (album)
      return 'album/' + album[1];
    return 'image/' + solo[1];
  }

  getQuery() {
    return this.props.imgur.queries.get(this.getRequest());
  }

  getNext() {
    return this.getEntry(1);
  }

  getPrev() {
    return this.getEntry(-1);
  }

  getEntry(offset=0) {
    const query = this.getQuery();
    const index = query.index + offset;
    if (index < 0 || index > query.entries.size)
      return null;
    return this.treatGif(query.entries.get(index));
  }

  fetchEntry() {
    const query = this.getQuery();
    const {entry} = this.props;
    if (!query)
      this.props.actions.imgurFetch(this.getRequest());
    else if (entry && !entry.get('preloaded') && query.entries.size) {
      this.props.actions.redditEntryPreload(entry);
      query.entries.slice(1).map(imgPreload);
    }
  }

  componentDidUpdate() {
    this.fetchEntry();
    this.setNav();
  }

  setNav() {
    const query = this.getQuery();
    if (!query || !query.entries.size || !this.props.nav)
      return;
    const prev = this.getPrev();
    const next = this.getNext();
    const first = this.getEntry(-query.index);
    const last = this.getEntry(query.entries.size-1);
    const step = this.props.actions.imgurStep;
    const index = query.index;
    const req = this.getRequest();
    const id = req + '/' + index;
    if (this.props.reddit.navActions.get('id') === id)
      return;
    this.props.actions.redditNavActions(
      id,
      prev ? (() => step(req, index - 1)) : null,
      next ? (() => step(req, index + 1)) : null,
      first ? (() => step(req, 0)) : null,
      last ? (() => step(req, query.entries.size-1)) : null,
      (index+1) + '/' + query.entries.size
    );
  }

  componentDidMount() {
    this.fetchEntry();
    this.setNav();
  }

  componentWillUnmount() {
    this.props.actions.redditNavActions('none', null, null);
  }

  treatGif(url) {
    if (!url)
      return url;
    const {pathname} = urlParse(url);
    if (pathname.match(/\.gif$/))
      return url + 'v';
    return url;
  }

  isVideo(url) {
    const {pathname} = urlParse(url);
    return pathname.match(/\.gifv$/);
  }

  imgId(url) {
    const {pathname} = urlParse(url);
    const parts = pathname.match(/\/([A-Za-z0-9]{4,})\./);
    return parts[1];
  }

  renderGifv(url) {
    const id = this.imgId(url);
    return (
      <div className="imgurGifv-aligner">
        <video
          preload="auto"
          autoPlay="autoplay"
          loop="loop"
          className="imgurGifv"
          src={`//i.imgur.com/${id}.webm`}
        />
      </div>
    );
  }

  render() {
    if (!this.getQuery())
      return (<Loader />);
    const entry = this.getEntry();
    if (!entry)
      return (<Loader />);
    if (this.isVideo(entry))
      return this.renderGifv(entry);
    return (
      <div className="imgur">
        <FsImg url={this.getEntry()}></FsImg>
      </div>
    );
  }

}
