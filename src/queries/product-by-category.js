import { gql } from "@apollo/client";

export const PRODUCT_BY_CATEGORY_SLUG = gql` query PRODUCT_BY_CATEGORY_SLUG($slug: ID!) {
	productCategory(id: $slug, idType: SLUG) {
	  id
      name
      slug
      categoryAcf{
          priceRange{
              priceMin
              priceMax
          }
        categoryAttributes{
          label
          attributes{
            attributeGroup{
              attributeTermLabel
              attributeTermSlug
              attributeSlug
            }
          }
        }
        categoryTags{
            label
            tags{
                name
            }
        }
        categoryBrands{
            name
        }
        categoryTypes{
            name
        }
      }
	  products(first: 6, where: {orderby: {field: DATE, order: DESC}}) {
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

          productCategories{
                edges{
                    node{
                        slug
                    }
                }
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
  }
  `;

export const PRODUCT_BY_CATEGORY_SLUG_ENDPOINT = gql` query PRODUCT_BY_CATEGORY_SLUG_ENDPOINT($slug: ID!, $endPoint: String!) {
	productCategory(id: $slug, idType: SLUG) {
	  id
      name
      slug
	  products(first: 6, after: $endPoint , last: null, before: null, where: {orderby: {field: DATE}}) {
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
  `;

export const PRODUCT_BY_CATEGORY_SLUG_ENDPOINT_BEFORE = gql` query   PRODUCT_BY_CATEGORY_SLUG_ENDPOINT_BEFORE ($slug: ID!, $startPoint: String!) {
	productCategory(id: $slug, idType: SLUG) {
	  id
      name
      slug
	  products(last: 6, before: $startPoint, first: null, after: null, where: {orderby: {field: DATE}}) {
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
  `;

export const PRODUCT_CATEGORIES_SLUGS = gql` query PRODUCT_CATEGORIES_SLUGS {
    productCategories {
    nodes {
      id
      slug
    }
  }
}`;

export const PRODUCT_CATEGORIES_PAGINATION = gql` query PRODUCT_CATEGORIES_PAGINATION($slug: ID!) {
	productCategory(id: $slug, idType: SLUG) {
	  id
	  products(first: 1000) {
		nodes {
		  id
		}
	  }
	}
  }
  `;

export const PRODUCT_CATEGORIES_PAGINATION_CURSORS = gql` query PRODUCT_CATEGORIES_PAGINATION_CURSORS($slug: ID!) {
	productCategory(id: $slug, idType: SLUG) {
	  id
	  products(first: 6) {
        pageInfo {
            startCursor
            endCursor
            hasNextPage
            hasPreviousPage
          }
	  }
	}
  }
  `;