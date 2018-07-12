import React, { Component } from 'react';
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.css'
import './App.css';

const baseDomain = 'http://gitlab-demo.hasura.io';

const graphqlUrl = `${baseDomain}:8090/v1alpha1/graphql`;

class App extends Component {
  state = {
    includeCookie: true
  }
  constructor() {
    super();

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false
    };
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
        <p className="Text"> Using session cookie </p>
      </div>
    );
    return (
      <div id="app" className="App">
        <div className="Banner">
          {`This GraphiQL uses your gitlab cookie to authenticate the requests. If you are not logged in, please `} <a href={ baseDomain }><button className={'form-control'}> Login</button></a>
        </div>
        <div className="ArchitectureText">
          This demo connects gitlab postgres using Hasura GraphQL engine. You can checkout the architecture <a href="/architecture.png">here</a>.
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
