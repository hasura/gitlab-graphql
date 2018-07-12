import React, { Component } from 'react';
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.css'
import './App.css';
const graphqlUrl = process.env.GRAPHQL_URL;

class App extends Component {

  state = {
    cookie: null,
    includeCookie: true
  }

  componentDidMount() {
    const gitlabSessionToken = this.getCookieValue("_gitlab_session");
    if (gitlabSessionToken) {
      this.setState({
        ...this.state,
        cookie: `_gitlab_session=${gitlabSessionToken}`
      });
    }
  }

  getCookieValue = (key) => {
    const value = document.cookie.match('(^|;)\\s*' + key + '\\s*=\\s*([^;]+)');
    return value ? value.pop() : '';
  }

  handleCheckbox = (status) => {
    this.setState({
      ...this.state,
      includeCookie: status
    })
  }

  render() {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (this.state.includeCookie) {
      headers['Cookie'] = this.state.cookie;
    }
    const graphqlFetcher = (graphQLParams) => {
      return fetch(graphqlUrl, {
        method: 'post',
        headers,
        body: JSON.stringify(graphQLParams),
      }).then(response => response.json());
    }

    return (
      <div className="App">
        <div className="Cookie">
          <input
            className="Checkbox"
            type="Checkbox"
            checked={this.state.includeCookie}
            onChange={(e) => {
              this.handleCheckbox(e.target.checked);
            }}
           />
          <p className="Text"> Using cookie: </p>
          <input className="Textbox" type="text" value={"lololololololol"} readOnly />
        </div>
        <GraphiQL
          fetcher={graphqlFetcher}
        />
      </div>
    );
  }
}

export default App;
