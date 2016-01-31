
import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React, {PropTypes} from 'react';
import Reader from './Reader.react';
import Loader from '../ui/Loader.react';

export default class Single extends Component {

  static propTypes = {
    actions: PropTypes.object,
    history: PropTypes.object,
    params: PropTypes.object,
    redditContent: PropTypes.object,
    redditUser: PropTypes.object,
  }

  componentWillReceiveProps(nextProps) {
    this.fetch(nextProps);
  }

  componentWillMount() {
    this.fetch(this.props);
  }

  entry(props) {
    props = props ? props : this.props;
    return props.redditContent.entries.get(props.params.id);
  }

  fetchInitial(props) {
    props.actions.redditFetchComments(
      props.redditUser.get('api'),
      props.params.id
    );
  }

  fetch(props) {
    const entry = this.entry(props);
    const comments = entry ? entry.get('comments') : null;
    const fetching = comments ? comments.get('fetching') : null;
    if (!entry || fetching === null)
      this.fetchInitial(props);
  }

  readerOrLoader() {
    const entry = this.entry();
    const comments = entry ? entry.get('comments') : false;
    if (!entry || comments.get('fetching') !== false)
      return (<Loader />);
    return (
      <Reader {...this.props} comments={true} />
    );
  }

  render() {
    return (
      <DocumentTitle title={this.props.params.id}>
        {this.readerOrLoader()}
      </DocumentTitle>
    );
  }

}
