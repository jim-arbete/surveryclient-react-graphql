import React, { } from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';

const GET_SURVEYS = gql`
  query {
    surveys {
      id
      title
      language
      type
      status
      root {
        children {
          question {
            id
            title
            options {
              id
              title
              value
            }
          }
        }
      }
    }
  }
`;

export const Surveys = () => (
  <Query query={GET_SURVEYS}>
    {({ loading, error, data }) => {
      if (loading) return "Loading...";
      if (error) return `Error! ${error.message}`;

      return (
        <>
          {data.surveys.map(({ id, title }) => (
          <div key={id}>
            {id}: {title}
          </div>
        ))}
       </>
      );
    }}
  </Query>
);

export default Surveys;
  