import { gql } from "@apollo/client";

const GET_USER = gql`
  query GET_USER ($input: ID!) {
    customer(id: $input) {
        firstName
        lastName
        email
        billing {
          address1
          address2
          city
          company
          country
          email
          firstName
          lastName
          phone
          postcode
          state
        }
        shipping {
          address1
          address2
          city
          company
          country
          email
          firstName
          lastName
          postcode
          state
        }
    }
  }
`;

export default GET_USER;
