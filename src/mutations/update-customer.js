import gql from "graphql-tag";

const UPDATE_CUSTOMER_MUTATION = gql`
mutation UPDATE_CUSTOMER_MUTATION( $input: UpdateCustomerInput! ) {
    updateCustomer(input: $input) {
        clientMutationId
  }
}
`;

export default UPDATE_CUSTOMER_MUTATION;
