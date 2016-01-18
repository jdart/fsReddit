
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import FsImg from './FsImg.react';
import {urlParse} from '../utils';
import Loader from '../ui/Loader.react';
import css from './Gfycat.styl';
import basename from 'basename';
import without from 'lodash/array/without';

export default class Imgur extends Component {

  static propTypes = {
    actions: PropTypes.object,
    url: PropTypes.string,
    imgur: PropTypes.object,
    reddit: PropTypes.object
  }

  getImage(offset=0, props) {
    const query = this.query;
    const index = query.index + offset;
    if (index < 0 || index > query.entries.size)
      return null;
    return props.imgur.images.get(
      query.entries.get(index)
    );
  }

  getImageByIndex(index, props) {
    const query = this.query;
    if (index < 0 || index > query.entries.size)
      return null;
    return props.imgur.images.get(
      query.entries.get(index)
    );
  }

  propsChanged(props) {
    this.request = this.imgId(props.url);
    this.query = props.imgur.queries.get(this.request);

    // need data from imgur
    if (this.fetchData(props))
      return;

    // mark reddit entry as preloaded
    if (props.preloading)
      return this.preload(props);

    // enqueue more images to preload, or preload images in queue
    if (!this.enqueueImages(props))
      this.runQueue(props);

    // set nav when fetching is done
    if (this.query.get('fetching') === false)
      this.setNav(props);
  }

  fetchData(props) {
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

    actions.redditEntryPreload(entry, { key: this.request });
  }

  enqueueImages(props) {
    const {actions} = props;
    const queue = props.imgur.preloadQueue;
    const next = [
      this.getImage(1, props),
      this.getImage(2, props),
    ].map(image =>
      image && image.get('preloaded') === null
        ? image.get('id')
        : null
    )
    .filter(image => image);

    const add = without(next, ...queue.get('images').toJS());

    if (add.length) {
      actions.imgurEnqueue(this.query, add);
      return true;
    }

    return false;
  }

  runQueue(props) {
    const queue = props.imgur.preloadQueue;
    if (
      !queue.get('images').size
      || queue.get('working')
    ) return false;

    const key = queue.get('images').first();
    const image = props.imgur.images.get(key);

    if (image.get('gifv'))
      return false;

    props.actions.imgurCacheImage(image);
    return true;
  }

  componentWillReceiveProps(nextProps) {
    this.propsChanged(nextProps);
  }

  componentWillMount() {
    this.propsChanged(this.props);
  }

  componentWillUnmount() {
    this.props.actions.redditNavActions('none', null, null);
  }

  setNav(props) {
    const query = this.query;
    const index = query.index;
    const req = this.request;
    const id = req + '/' + index;
    if (props.reddit.navActions.get('id') === id)
      return;

    const prev = this.getImage(-1, props);
    const next = this.getImage(1, props);
    const first = this.getImage(-query.index, props);
    const last = this.getImage(query.entries.size-1, props);
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
    return basename(urlParse(url).pathname);
  }

  renderGifv(url) {
    const id = this.imgId(url);
    this.onload();
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
    const image = this.getImage(0, this.props);
    const action = this.props.actions.imgurImageCached;
    if (image.get('preloaded'))
      return;

    setTimeout(() => action(image));
  }

  render() {
    if (!this.query || this.query.get('fetching') !== false)
      return (<Loader />);

    const image = this.getImage(0, this.props);
    const gifv = image.get('gifv');
    const url = image.get('url');
    const images = this.query.get('entries');

    if (gifv)
      return this.renderGifv(gifv);

    return (
      <div className="imgur">
        {image.get('preloaded') ? '' : (<Loader />)}
        <FsImg
          onload={this.onload.bind(this)}
          url={url}
          tallMode={images.size === 1}
        />
      </div>
    );
  }

}
