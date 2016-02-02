
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import FsImg from './FsImg.react';
import Loader from '../ui/Loader.react';
import without from 'lodash/without';
import {imgurQuery, parse, runQueue} from '../../common/imgur/utils';
import Video from './Video.react';

export default class Imgur extends Component {

  static propTypes = {
    actions: PropTypes.object,
    imgur: PropTypes.object,
    preloading: PropTypes.bool,
    url: PropTypes.string,
  }

  getImage(offset = 0, props) {
    const query = this.query;
    const index = query.get('index') + offset;
    const imageId = query.getIn(['entries', index]);
    if (index < 0 || index > query.get('entries').size)
      return null;
    return props.imgur.getIn(['images', imageId]);
  }

  getImageByIndex(index, props) {
    const query = this.query;
    if (index < 0 || index > query.entries.size)
      return null;
    return props.imgur.getIn([
      'images',
      query.getIn(['entries', index])
    ]);
  }

  propsChanged(props) {
    this.query = imgurQuery(props.url, props.imgur);

    // need data from imgur
    if (this.fetchData(props))
      return;

    const success = this.query.get('fetching') === false
      && !this.query.get('failed');
    if (!success)
      return;

    // enqueue more images to preload, or preload images in queue
    if (!this.enqueueImages(props))
      runQueue(props.imgur, props.actions.imgurQueueRun);
  }

  fetchData(props) {
    const {entry, actions} = props;
    if (this.query)
      return false;

    actions.imgurFetch(entry);
    return true;
  }

  enqueueImages(props) {
    const {actions, preloading} = props;
    const queue = props.imgur.get('preloadQueue');
    const currIndex = this.query.get('index');
    const nextIndexes = preloading ? [0] : [currIndex + 1, currIndex + 2];
    const nextImageIds = nextIndexes
      .map((index) => this.getImageByIndex(index, props))
      .filter(image => image)
      .filter(image => image.get('preloaded') === null)
      .filter(image => !image.get('gifv'))
      .map(image => image.get('id'));


    const add = without(nextImageIds, ...queue.get('images').toJS());

    if (add.length) {
      actions.imgurQueueAdd(add);
      return true;
    }

    return false;
  }

  componentWillReceiveProps(nextProps) {
    this.propsChanged(nextProps);
  }

  componentWillMount() {
    this.propsChanged(this.props);
  }

  imgId(url) {
    return parse(url).id;
  }

  renderGifv(url) {
    const id = this.imgId(url);
    this.onload();
    return (
      <Video url={`//i.imgur.com/${id}.webm`} />
    );
  }

  onload() {
    const image = this.getImage(0, this.props);
    const {imgurImageCached} = this.props.actions;
    if (image.get('preloaded'))
      return;

    setTimeout(() => imgurImageCached(image));
  }

  render() {
    if (!this.query || this.query.get('fetching') !== false)
      return (<Loader />);

    if (this.props.preloading)
      return (<div/>);

    if (this.query.get('failed'))
      return (<div className="failed">Failed to find content on imgur.</div>);

    const image = this.getImage(0, this.props);
    const {gifv, url, title, description} = image;
    const caption = [title, description]
      .filter(s => !!s)
      .join(' - ');
    const images = this.query.entries;

    if (gifv)
      return this.renderGifv(gifv);

    return (
      <div className="imgur">
        {image.get('preloaded') ? '' : (<Loader />)}
        <FsImg
          {...{caption, url}}
          onload={this.onload.bind(this)}
          tallMode={images.size === 1}
        />
      </div>
    );
  }

}
