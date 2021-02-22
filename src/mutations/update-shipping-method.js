import gql from "graphql-tag";

const UPDATE_SHIPPING_METHOD_MUTATION = gql`
mutation UPDATE_SHIPPING_METHOD_MUTATION( $input: UpdateShippingMethodInput! ) {
    updateShippingMethod (input: $input) {
        clientMutationId
  }
}
`;

export default UPDATE_SHIPPING_METHOD_MUTATION;
