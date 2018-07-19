import React, { Component } from 'react';
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.css'
import './App.css';

const baseDomain = 'http://gitlab-demo.hasura.io';

const graphqlUrl = `${baseDomain}:8090/v1alpha1/graphql`;

const defaultQueries = `
query fetch_all_public_projects {
  projects {
      id
    name
    visibility_level
    path
    description
    creator_id
    namespace_id
    star_count
  }
}

query fetch_all_public_users_info {
	users {
    id
    name
    avatar
    state
    username
    website_url
  }
}

# Please sign in to gitlab-demo.hasura.io before making this query
# and please ensure that you have selected \`Query using the GitLab session cookie checkbox\`
query fetch_private_projects {
  projects {
    id
    name
    visibility_level
    path
    description
    creator_id
    namespace_id
    star_count
  }
}

# Please ensure that you are signed in to gitlab-demo.hasura.io before making this query
# and please ensure that you have selected \`Query using the GitLab session cookie checkbox\`

query fetch_your_private_user_info {
  users {
      id
      name
      username
      state
      avatar
      website_url
      created_at
      bio
      location
      skype
      linkedin
      twitter
      website_url
      organization
      last_sign_in_at
      confirmed_at
      last_activity_on
      email
      theme_id
      color_scheme_id
      projects_limit
      current_sign_in_at
      can_create_group
      external
  }
}
`

class App extends Component {
  state = {
    includeCookie: true
  }
  constructor() {
    super();

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false,
      isLoggedIn: false,
      demoUsername: 'demo-user',
      demoPassword: 'demo@hasura',
      userNameCopied: false,
      passwordCopied: false,
    };
  }

  componentDidMount() {
    this.fetchLoggedInUser();
  }

  copyToClipBoard(text, copiedText) { 
    return () => {
      var el = document.createElement('textarea');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      el.setAttribute('readonly', '');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      var success = document.execCommand('copy');
      document.body.removeChild(el);
      this.setState({ ...this.state, [copiedText]: true});

      setTimeout(() => {
        this.setState({ ...this.state, [copiedText]: false});
      }, 2000);
      return success;
    };
  }


  fetchLoggedInUser() {
    const fetchUrl = `${ baseDomain }/api/v4/user`;
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }

    fetch( fetchUrl, options ).then((resp) => {
      return resp.json();
    }).then((resp) => {
      if ('id' in resp) {
        this.setState({ ...this.state, isLoggedIn: true });
      }
    });

  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  handleCheckbox = (status) => {
    this.setState({
      ...this.state,
      includeCookie: status
    })
  }

  render() {
    const credentials = this.state.includeCookie ? 'include' : 'omit';

    const graphqlFetcher = (graphQLParams) => {
      return fetch(graphqlUrl, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials,
        body: JSON.stringify(graphQLParams),
      }).then(response => response.json());
    }

    const toggleCookie = () => (
      <div className="Cookie">
        <input
          className="Checkbox"
          type="Checkbox"
          checked={this.state.includeCookie}
          onChange={(e) => {
            this.handleCheckbox(e.target.checked);
          }}
         />
        <p className="Text"> Query using the GitLab session cookie </p>
      </div>
    );
    return (
      <div id="app" className="App">
        <div className="Banner">
          {`This GraphiQL uses your GitLab cookie to authenticate the requests. If you are not logged in, please `} <a href={ baseDomain }><button className={'form-control'}> Login @ GitLab </button></a>
        </div>
        <div className="GitlabLoginHelp">
          If you don't have an account. You can use the demo credentials as shown below to login.
        </div>
        <div className="GitlabCredentials">
          <div className="usernameInput inputElement">
            <span className="label">Username:</span>
            <input disabled type="text" value={ this.state.demoUsername } />
            <button className="copyButton" onClick={ this.copyToClipBoard(this.state.demoUsername, 'userNameCopied') }>{ this.state.userNameCopied ? 'Copied' : 'Copy' }</button>
          </div>
          <div className="passwordInput inputElement">
            <span className="label">Password:</span>
            <input disabled type="password" value={ this.state.demoPassword } />
            <button className="copyButton" onClick={ this.copyToClipBoard( this.state.demoPassword, 'passwordCopied') }>{ this.state.passwordCopied ? 'Copied' : 'Copy' }</button>
          </div>
        </div>
        <div className="ArchitectureText">
          This demo connects to GitLab postgres via the Hasura GraphQL engine. <a href="/architecture.png">View an architecture diagram</a>.
        </div>
        {this.state.isLoggedIn ? toggleCookie() : null }
        <div className="graphql_wrapper">
          <GraphiQL
            fetcher={graphqlFetcher}
            query={ defaultQueries }
          />
        </div>
      </div>
    );
  }
}

export default App;
