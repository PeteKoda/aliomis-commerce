import gql from "graphql-tag";

const LOG_IN_USER = gql`

mutation LoginUser ($input: LoginInput!){
    login( input: $input ) {
      authToken
      customer {
        id
        username
        databaseId
      }
    }
  }
`
export default LOG_IN_USER;
