import gql from "graphql-tag";

const RESET_USER_PASSWORD_MUTATION = gql`
  mutation resetUserPassword($input: ResetUserPasswordInput!) {
    resetUserPassword(input: $input) {
        clientMutationId
    }
  }
`
export default RESET_USER_PASSWORD_MUTATION;
