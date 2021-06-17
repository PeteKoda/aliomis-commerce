import { gql } from "@apollo/client";

export const PRODUCT_BY_SLUG_QUERY = gql` query Product($slug: ID!) {
	product(id: $slug, idType: SLUG) {
	  id
	  databaseId
	  averageRating
	  slug
	  description
      shortDescription
	  galleryImages {
          nodes {
            id
            title
            altText
            mediaItemUrl
            srcSet
            sourceUrl(size:PRODUCT_IMAGE_KD)
          }
      }
	  image {
		id
		uri
		title
		srcSet
		sourceUrl
      }
      
      brands{
        edges{
          node{
            name
            description
          }
        }
      }
      name
      averageRating

      shippingClasses{
        edges{
            node{
                name
                uri
            }
        }
      }
      
      productAcf{
        additionalInformation{
          row{
            col{
              entry
            }
          }
        }
      }

      upsell(first: 4){
        edges{
          node{
            id
            databaseId
            averageRating
            slug
            description
            image {
              id
              uri
              title
              srcSet
              sourceUrl
            }
            name
            productCategories{
                edges{
                  node{
                    slug
                  }
                }
            }       
            ... on SimpleProduct {
              price
              regularPrice
              id
            }
            ... on VariableProduct {
              price
              regularPrice
              id
            }
            ... on ExternalProduct {
              price
              id
              regularPrice
              externalUrl
            }
            ... on GroupProduct {
              products {
                nodes {
                  ... on SimpleProduct {
                    id
                    regularPrice
                    price
                  }
                }
              }
              id
            }
          }
        }
      }

      related(first: 4) {
        edges {
          node {
            id
            databaseId
            averageRating
            slug
            description
            image {
              id
              uri
              title
              srcSet
              sourceUrl
            }
            name
            productCategories{
                edges{
                  node{
                    slug
                  }
                }
            }       
            ... on SimpleProduct {
              price
              regularPrice
              id
            }
            ... on VariableProduct {
              price
              regularPrice
              id
            }
            ... on ExternalProduct {
              price
              id
              regularPrice
              externalUrl
            }
            ... on GroupProduct {
              products {
                nodes {
                  ... on SimpleProduct {
                    id
                    regularPrice
                    price
                  }
                }
              }
              id
            }
          }
        }
      }
	  ... on SimpleProduct {
		price
		id
		regularPrice
        stockQuantity
	  }
	  ... on VariableProduct {
		price
		id
		regularPrice
        stockQuantity
	  }
	  ... on ExternalProduct {
		price
		id
		regularPrice
		externalUrl
	  }
	  ... on GroupProduct {
		products {
		  nodes {
			... on SimpleProduct {
			  id
			  price
			  regularPrice
			}
		  }
		}
		id
	  }
	}
  }
`;

export const PRODUCT_SLUGS = gql`query ProductCategories {
    productCategories(first:1000, where: {exclude:[15,82]}){
        edges{
          node{
            slug
            products(first:1000){
              edges{
                node{
                  slug
                }
              }
            }
          }
        }
    }
}
`;
