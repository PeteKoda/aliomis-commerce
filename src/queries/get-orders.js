import { gql } from "@apollo/client";

const GET_ORDERS = gql`
    query GET_ORDERS ($input: Int!) {
        orders(where: {customerId: $input}) {
            edges {
                node {
                    datePaid
                    total
                    shipping{
                        address1
                    }
                    status
                    databaseId
                }
            }
        }
    }
`;

export default GET_ORDERS;
