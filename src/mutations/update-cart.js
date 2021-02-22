import gql from "graphql-tag";

/**
 * Update Cart
 *
 * This query is used for both updating the items in the cart and delete a cart item.
 * When the cart item needs to be deleted, we should pass quantity as 0 in the input along with other fields.
 */
const UPDATE_CART = gql`
  mutation ($input: UpdateItemQuantitiesInput!) {
    updateItemQuantities(input: $input) {
		items {
        key
        product {
          id
          databaseId
          name
          description
          type
          onSale
          slug
          averageRating
          reviewCount
          image {
            id
            sourceUrl
            altText      
          }
          galleryImages {
            nodes {
              id
              sourceUrl
              altText
            }
          }
        }
        variation {
          id
          databaseId
          name
          description
          type
          onSale
          price
          regularPrice
          salePrice
          image {
            id
            sourceUrl
            altText      
          }
              attributes {
            nodes {
              id
          attributeId
              name
              value
            }
          }
        }
        quantity
        total
        subtotal
        subtotalTax
      }
      removed {
        key
        product {
          id
            databaseId
        }
        variation {
          id
          databaseId
        }
      }
      updated {
        key
        product {
          id
            databaseId
        }
        variation {
          id
          databaseId
        }
      }
    }
  }
`;

export default UPDATE_CART;
