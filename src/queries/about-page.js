import { gql } from "@apollo/client";

const CONTACT_PAGE_QUERY = gql`
    query CONTACT_PAGE_QUERY ($id: ID!) {
        page (id: $id){
            title
            aboutPageAcf{
                introGroup{
                    h1
                    h2
                    description
                    backgroundImage{
                        altText
                        sourceUrl
                    }
                }
                about{
                    title
                    subtitle
                    description
                    image{
                        altText
                        sourceUrl
                    }
                    
                }
            }
        }
    }
`;

export default CONTACT_PAGE_QUERY
;
