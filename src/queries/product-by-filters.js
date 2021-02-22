import { gql } from "@apollo/client";

export const PRODUCT_BY_FILTERS = gql` query PRODUCT_BY_FILTERS($categorySlug: String, $terms: [String], $taxonomy: ProductTaxonomyEnum!, $tagIn: [String], $attribute: String, $attributeTerm: String ) {
	  products( where: { tagIn: $tagIn , attribute: $attribute, attributeTerm: $attributeTerm ,category: $categorySlug , taxonomyFilter:{or:{terms: $terms , taxonomy: $taxonomy}}  }) {
        pageInfo {
            startCursor
            endCursor
            hasNextPage
            hasPreviousPage
        }
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
  `;

  export const PRODUCT_BY_CATEGORY_SEARCH = gql` query PRODUCT_BY_CATEGORY_SEARCH($search: String) {
    productCategories {
        edges{
            node{
                name
                slug
                products(where:{search: $search}){
                    edges{
                        node{
                        name
                        }
                    }
                }
            }
        }
    }
}
`;

  

  