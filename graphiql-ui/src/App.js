import React, { Component } from 'react';
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.css'
import './App.css';
import demoImage from './assets/gitlab-graphql-demo.png';

const baseDomain = 'http://178.128.180.80';

const graphqlUrl = `${baseDomain}:8090/v1alpha1/graphql`;

class App extends Component {
  state = {
    includeCookie: true
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
      'credentials': 'omit'
    };

    if (this.state.includeCookie) {
      headers['credentials'] = 'include';
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
        <p className="Text"> Using session cookie </p>
      </div>
    );
    return (
      <div className="App">
        <div className="Banner">
          {`This GraphiQL uses your gitlab cookie to authenticate the requests. If you are not logged in, `} <a href={baseDomain}> please login here. </a>
        </div>
        <h3 className="Header">Architecture</h3>
        <div className="Description">
          <img src= {demoImage} alt="architecture"/>
        </div>
        {toggleCookie()}
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
