import { gql } from "@apollo/client";

/**
 * GraphQL categories and products query.
 */
const PRODUCTS_AND_CATEGORIES_QUERY = gql`query {
  productCategories(first: 100) {
    nodes {
      id
      name
      slug
      image {
        id
        sourceUrl
        srcSet
      }

      products(first: 4, where: {orderby: {field: DATE, order: DESC}}) {
		nodes {
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
  }
}
`;

export default PRODUCTS_AND_CATEGORIES_QUERY;
