
import Component from 'react-pure-render/component';
import PropTypes from 'prop-types';
import React from 'react';
import ReaderFetcher from './ReaderFetcher.react';

export default class Subreddit extends Component {

  static propTypes = {
    params: PropTypes.object,
  }

  generateUrl(props) {
    const {params} = this.props;
    if (!params.name)
      return '/' + (params.sort || 'hot');
    return '/r/' + params.name + '/' + (params.sort || 'hot');
  }

  render() {
    return (
      <ReaderFetcher url={this.generateUrl()} {...this.props} />
    );
  }

}
