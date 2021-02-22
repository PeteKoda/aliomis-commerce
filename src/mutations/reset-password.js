import gql from "graphql-tag";

const RESET_PASSWORD_MUTATION = gql`
  mutation sendPasswordResetEmail($input: SendPasswordResetEmailInput!) {
    sendPasswordResetEmail(input: $input) {
        clientMutationId
    }
  }
`
export default RESET_PASSWORD_MUTATION;
