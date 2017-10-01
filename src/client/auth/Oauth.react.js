
import Component from 'react-pure-render/component';
import DocumentTitle from 'react-document-title';
import React from 'react';
import PropTypes from 'prop-types';
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
    const {history, redditUser, actions} = this.props;
    const qs = queryString.parse(window.location.hash);
    if (!redditUser.loaded)
      return;
    if (redditUser.oauth.fetching === null) {
      actions.redditUser.loginValidate(qs);
    } else if (redditUser.authenticated) {
      actions.redditUser.loggedIn(history);
      actions.flash.enqueue(
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

