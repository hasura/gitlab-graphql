import React, { Component } from 'react';
// import GraphiQL from 'graphiql';
import logo from './logo.svg';
import './App.css';
const graphqlUrl = process.env.GRAPHQL_URL || 'https://demooooo.herokuapp.com/v1alpha1/query';

class App extends Component {

  render() {
    // const graphqlFetcher = (graphQLParams) => {
    //   return fetch(graphqlUrl, {
    //     method: 'post',
    //     headers: { 'Content-Type': 'application/json', 'x-hasura-access-key': '12345' },
    //     body: JSON.stringify(graphQLParams),
    //   }).then(response => response.json());
    // }

    return (
      <div className="App">
        Hello
      </div>
    );
  }
}

export default App;
