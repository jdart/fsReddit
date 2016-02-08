
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
    const {history} = this.props;
    const qs = queryString.parse(window.location.hash);
    if (!this.props.redditUser.loaded)
      return;
    if (this.props.redditUser.oauth.fetching === null) {
      this.props.actions.redditUser.loginValidate(qs);
    } else if (this.props.redditUser.authenticated) {
      this.props.actions.redditUser.loggedIn(history);
      this.props.actions.flash.enqueue(
        'Successfully logged in!<br>Your session will expire in 1 hour.',
        'success'
      );
    }
  }

  render() {
    return (
      <DocumentTitle title="Authenticate">
        <div className="validating-page-content padded-content">
          <h2>Validating user...</h2>
        </div>
      </DocumentTitle>
    );
  }

}

