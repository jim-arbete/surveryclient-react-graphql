import React, { useEffect } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { SurveyResponses } from '../Survey/SurveyResponses'
// import { Surveys } from '../Survey/Surveys'
import logo from './logo.svg';


const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URL ? process.env.REACT_APP_GRAPHQL_URL : '',
  fetchOptions: {
    credentials: 'include'
  },
  request: async (operation) => {
    const token = await localStorage.getItem('token');
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : ''
      }
    });
  },
});

const App = () => {

  useEffect(() => {
    // Mock the login token.. in dev mode.
    localStorage.setItem(
      'token',
      process.env.REACT_APP_API_TOKEN ? process.env.REACT_APP_API_TOKEN : ''
    )
  }, []);

  return (
    <ApolloProvider client={client}>

      <header className="grid navbar">
        <div></div>
        <div className="flex logo">
          <a href="/"><img src={logo} className="flex flex-vertical-center App-logo" alt="logo" /></a>
          <a href="/">React - Survey Client</a>
        </div>
        <div></div>
      </header>
      {! localStorage.getItem('token') && <p>NO AUTH TOKEN: type $ <code>localStorage.setItem('token', 'yoursecretkey') </code> in browser [Console] <br />
      To set tokens manually in chrome/safari go to [Application => Local Storage] in chromium dev tools<br />
      Hit F5 refresh when done.
      </p> }
      <div id="main" className="grid">
        <div></div>
        <div>
          <article>
            <SurveyResponses />
          </article>
        </div>
        <div></div>
      </div>
    </ApolloProvider>
  );

}

export default App;
  