
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

  getRequest(props) {
    const url = urlParse(props.url);
    const album = url.pathname.match(/\/a\/([A-Za-z0-9]{4,})/);
    const solo = url.pathname.match(/\/([A-Za-z0-9]{4,})/);
    if (album)
      return 'album/' + album[1];
    return 'image/' + solo[1];
  }

  getNext() {
    return this.getImage(1);
  }

  getPrev() {
    return this.getImage(-1);
  }

  getImage(offset=0) {
    const query = this.query;
    const index = query.index + offset;
    if (index < 0 || index > query.entries.size)
      return null;
    return this.props.imgur.images.get(
      query.entries.get(index)
    );
  }

  getImageByIndex(index) {
    const query = this.query;
    if (index < 0 || index > query.entries.size)
      return null;
    return this.props.imgur.images.get(
      query.entries.get(index)
    );
  }

  fetchImageData(props) {
    const {entry, actions} = props;
    if (!this.query) {
      actions.imgurFetch(this.request);
      return;
    }
    if (
      !entry.get('preloaded')
      && this.query.get('fetching') === false
    ) {
      actions.redditEntryPreload(entry, {
        key: this.request,
        index: props.preloading ? 0 : 1,
      });
      return;
    }
    if (
      !props.preloading
      && props.imgur.preloadQueue.get('images').size
      && !props.imgur.preloadQueue.get('working')
    ) {
      actions.imgurPreloadNext(
        props.imgur.images.get(
          props.imgur.preloadQueue.get('images').first(),
        )
      );
    }
  }

  shortcuts(props) {
    this.request = this.getRequest(props);
    this.query = props.imgur.queries.get(this.request);
  }

  componentWillReceiveProps(nextProps) {
    this.shortcuts(nextProps);
    this.fetchImageData(nextProps);
    this.setNav();
  }

  componentWillMount() {
    this.shortcuts(this.props);
    this.fetchImageData(this.props);
    this.setNav();
  }

  componentWillUnmount() {
    this.props.actions.redditNavActions('none', null, null);
  }

  setNav(props) {
    const query = this.query;
    if (!query || !query.entries.size || this.props.preloading)
      return;
    const prev = this.getPrev();
    const next = this.getNext();
    const first = this.getImage(-query.index);
    const last = this.getImage(query.entries.size-1);
    const step = this.props.actions.imgurStep;
    const index = query.index;
    const req = this.request;
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

  imageUrl(url) {
    return this.treatGif(url);
  }

  render() {
    if (!this.query || this.query.get('fetching') !== false)
      return (<Loader />);
    const image = this.getImage();
    const url = this.imageUrl(image.get('url'));
    if (this.isVideo(url))
      return this.renderGifv(url);
    return (
      <div className="imgur">
        <FsImg url={url}></FsImg>
      </div>
    );
  }

}
