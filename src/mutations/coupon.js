import gql from "graphql-tag";

const APPLY_CUSTOMER_COUPON = gql`
mutation APPLY_CUSTOMER_COUPON( $input: ApplyCouponInput! ) {
    applyCoupon(input: $input) {
        clientMutationId
  }
}
`;

export default APPLY_CUSTOMER_COUPON;
