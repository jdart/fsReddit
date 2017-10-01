
import Component from 'react-pure-render/component';
import PropTypes from 'prop-types';
import React from 'react';
import ReaderFetcher from './ReaderFetcher.react';

export default class User extends Component {

  static propTypes = {
    params: PropTypes.object,
  }

  generateUrl() {
    return '/user/' + this.props.params.name + '/submitted';
  }

  render() {
    return (
      <ReaderFetcher url={this.generateUrl()} {...this.props} />
    );
  }

}
