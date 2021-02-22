import gql from "graphql-tag";

const REFRESH_TOKEN = gql`
mutation REFRESH_TOKEN( $input: RefreshJwtAuthTokenInput! ) {
    refreshJwtAuthToken (input: $input) {
        authToken
  }
}
`;

export default REFRESH_TOKEN;
