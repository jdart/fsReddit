
import Component from 'react-pure-render/component';
import PropTypes from 'prop-types';
import React from 'react';
import ReaderFetcher from './ReaderFetcher.react';

export default class Upvoted extends Component {

  static propTypes = {
    params: PropTypes.object,
    redditUser: PropTypes.object,
  }

  generateUrl() {
    const name = this.props.redditUser.details.get('name');
    if (!name)
      return;
    return `/user/${name}/upvoted`;
  }

  render() {
    return (
      <ReaderFetcher url={this.generateUrl()} {...this.props} />
    );
  }

}
