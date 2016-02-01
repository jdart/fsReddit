
import Component from 'react-pure-render/component';
import React, {PropTypes} from 'react';
import ReaderFetcher from './ReaderFetcher.react';

export default class Upvoted extends Component {

  static propTypes = {
    params: PropTypes.object,
    redditUser: PropTypes.object,
  }

  generateUrl(props) {
    const name = props.redditUser.details.get('name');
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
