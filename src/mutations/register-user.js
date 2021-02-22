import gql from "graphql-tag";

const REGISTER_USER = gql`
  mutation registerCustomer($input: RegisterCustomerInput!) {
    registerCustomer(input: $input) {
        authToken
        customer {
          id
          username
        }
    }
  }
`
export default REGISTER_USER;
