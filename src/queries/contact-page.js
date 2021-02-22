import { gql } from "@apollo/client";

const CONTACT_PAGE_QUERY = gql`
    query CONTACT_PAGE_QUERY ($id: ID!) {
        page (id: $id){
            title
            contactPageAcf{
                h1
                backgroundImage{
                  altText
                  sourceUrl
                }
                contact{
                  title
                  subtitle
                  description
                  storeDetails
                }
            }
        }
    }
`;

export default CONTACT_PAGE_QUERY
;
