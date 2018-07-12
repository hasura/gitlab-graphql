import React, { Component } from 'react';
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.css'
import './App.css';
import demoImage from './assets/gitlab-graphql-demo.png';

const baseDomain = 'http://178.128.180.80';

const graphqlUrl = `${baseDomain}:8090/v1alpha1/graphql`;

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
        cookie: gitlabSessionToken
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
      headers['x-gitlab-cookie'] = this.state.cookie;
    }

    const graphqlFetcher = (graphQLParams) => {
      return fetch(graphqlUrl, {
        method: 'post',
        headers,
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
        <p className="Text"> Using header: </p>
        <input className="Textbox" type="text" value={`{ "x-gitlab-key" : "${this.state.cookie}" }`} readOnly />
      </div>
    );
      
    return (
      <div className="App">
        <div className="Banner">
          {`This GraphiQL uses your gitlab cookie to authenticate the requests. If you are not logged in, `} <a href={baseDomain}> please login here. </a>
        </div>
        <h3 className="Header">Architecture</h3>
        <div className="Description">
          <img alt="architecture" src= {demoImage} />
        </div>
        {this.state.cookie ? toggleCookie() : null}
        <div className="graphql_wrapper">
          <GraphiQL
            fetcher={graphqlFetcher}
          />
        </div>
      </div>
    );
  }
}

export default App;