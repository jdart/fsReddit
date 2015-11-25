
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import FsImg from './FsImg.react';
import {imgPreload, urlParse} from '../utils';
import Loader from '../ui/Loader.react';
import css from './Gfycat.styl';
import basename from 'basename';

export default class Imgur extends Component {

  static propTypes = {
    actions: PropTypes.object,
    url: PropTypes.string,
    imgur: PropTypes.object,
    reddit: PropTypes.object
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

  propsChanged(props) {
    this.request = this.imgId(props.url);
    this.query = props.imgur.queries.get(this.request);

    if (!this.fetchApiData(props))
      if (!this.preload(props))
        this.preloadMore(props);

    if (
      !props.preloading
      && this.query
      && this.query.get('fetching') === false
    ) this.setNav(props);
  }

  fetchApiData(props) {
    const {entry, actions} = props;
    if (this.query)
      return false;

    actions.imgurFetch(entry);
    return true;
  }

  preload(props) {
    const {entry, actions} = props;
    if (
      entry.get('preloaded')
      || this.query.get('fetching') !== false
    ) return false;

    actions.redditEntryPreload(entry, {
      key: this.request,
      index: props.preloading ? 0 : 1,
    });
    return true;
  }

  preloadMore(props) {
    const {actions} = props;
    const queue = props.imgur.preloadQueue;
    if (
      props.preloading
      || !queue.get('images').size
      || queue.get('working')
    ) return false;

    const key = props.imgur.preloadQueue.get('images').first();
    const image = props.imgur.images.get(key);
    actions.imgurPreloadNext(image);
    return true;
  }

  componentWillReceiveProps(nextProps) {
    this.propsChanged(nextProps);
  }

  componentWillMount() {
    this.propsChanged(this.props);
  }

  setNav(props) {
    const query = this.query;
    const index = query.index;
    const req = this.request;
    const id = req + '/' + index;
    if (props.reddit.navActions.get('id') === id)
      return;

    const prev = this.getImage(-1);
    const next = this.getImage(1);
    const first = this.getImage(-query.index);
    const last = this.getImage(query.entries.size-1);
    const step = props.actions.imgurStep;

    props.actions.redditNavActions(
      id,
      prev ? (() => step(req, index - 1)) : null,
      next ? (() => step(req, index + 1)) : null,
      first ? (() => step(req, 0)) : null,
      last ? (() => step(req, query.entries.size-1)) : null,
      (index+1) + '/' + query.entries.size
    );
  }

  imgId(url) {
    const {pathname} = urlParse(url);
    return basename(pathname);
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

  onload() {
    const image = this.getImage();
    if (!image.get('preloaded'))
      this.props.actions.imgurImagePreloaded(image);
  }

  render() {
    if (!this.query || this.query.get('fetching') !== false)
      return (<Loader />);

    const image = this.getImage();
    const gifv = image.get('gifv');
    const url = image.get('url');

    if (gifv)
      return this.renderGifv(gifv);

    return (
      <div className="imgur">
        {image.get('preloaded') ? '' : (<Loader />)}
        <FsImg onload={this.onload.bind(this)} url={url}></FsImg>
      </div>
    );
  }

}
