
import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React, {PropTypes} from 'react';
import queryString from 'query-string';

export default class Oauth extends Component {

  static propTypes = {
    actions: PropTypes.object,
    history: PropTypes.object,
    redditUser: PropTypes.object,
  }

  componentDidMount() {
    this.runActions();
  }

  componentDidUpdate() {
    this.runActions();
  }

  runActions() {
    const {reddit, history} = this.props;
    const qs = queryString.parse(window.location.hash);
    if (!this.props.redditUser.get('loaded'))
      return;
    if (this.props.redditUser.oauth.get('fetching') === null) {
      this.props.actions.redditLoginValidate(qs);
    } else if (this.props.redditUser.get('authenticated')) {
      this.props.actions.redditLoggedIn(history);
    }
  }

  render() {
    return (
      <DocumentTitle title="Authenticate">
        <div>
          <h2>Validating user...</h2>
        </div>
      </DocumentTitle>
    );
  }

}

