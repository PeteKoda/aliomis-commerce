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
	  products(first: 24, where: {orderby: {field: MENU_ORDER, order: ASC}}) {
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

          shippingClasses{
            edges{
                node{
                    name
                    uri
                }
            }
          }

          awards{
            edges{
              node{
                name
                description
                awardAcf{
                  image{
                    sourceUrl
                    altText
                  }
                }
              }
            }
          }

		  name
		  ... on SimpleProduct {
			price
			regularPrice
			id
            stockQuantity
		  }
		  ... on VariableProduct {
			price
			regularPrice
			id
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


  export const PRODUCTS_BY_CATEGORY_SLUG = gql` query PRODUCTS_BY_CATEGORY_SLUG($offset: Int, $slug: String) {
	products(where: {offsetPagination: {offset: $offset , size: 9}, category: $slug}) {
        pageInfo {
          offsetPagination {
            total
            hasMore
          }
        }
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
              altText
            }
            productCategories {
              edges {
                node {
                       id
                    name
                    slug
                    parent{
                      node{
                        slug
                      }
                    }
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
                }
              }
            }
            awards {
              edges {
                node {
                  name
                  description
                  awardAcf {
                    image {
                      sourceUrl
                      altText
                    }
                  }
                }
              }
            }
            paColors {
              edges {
                node {
                  name
                }
              }
            }
            name
            ... on SimpleProduct {
              price
              regularPrice
              id
              stockQuantity
            }
            ... on VariableProduct {
              price
              regularPrice
              id
              stockQuantity
              variations {
                nodes {
                  databaseId
                  name
                  stockQuantity
                  price
                  salePrice
                  sku
                  attributes {
                    edges {
                      node {
                        id
                        name
                        value
                        label
                      }
                    }
                  }
                  featuredImage {
                    node {
                      sourceUrl
                      altText
                    }
                  }
                }
              }
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
    productCategories(first: 200) {
        nodes {
            id
            slug
            parent{
                node{
                  slug
                }
            }
            products{
                pageInfo{
                  offsetPagination{
                    total
                  }
                }
            }
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