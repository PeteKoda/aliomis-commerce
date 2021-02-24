import gql from "graphql-tag";

const REMOVE_CUSTOMER_COUPON = gql`
mutation REMOVE_CUSTOMER_COUPON( $input: RemoveCouponsInput! ) {
    removeCoupons(input: $input) {
        clientMutationId
  }
}
`;

export default REMOVE_CUSTOMER_COUPON;
