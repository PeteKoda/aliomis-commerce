import { gql } from "@apollo/client";

const GET_CART = gql`
  query GET_CART {
    cart {
      contents {
        nodes {
          key
          product {
            id
            sku
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
                srcSet
                altText
                title       
            }
            galleryImages {
              nodes {
                id
                sourceUrl
                srcSet
                altText
                title   
              }
            }
            ... on SimpleProduct {
                crossSell{
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
              srcSet
              altText
              title      
            }
            attributes {
              nodes {
                id
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
      }
      appliedCoupons {
        nodes {
          id
          databaseId
          discountType
          amount
          dateExpiry
          products {
            nodes {
              id
            }
          }
          productCategories {
            nodes {
              id
            }
          }
        }
      }
      subtotal
      subtotalTax
      shippingTax
      shippingTotal
      total
      totalTax
      feeTax
      feeTotal
      discountTax
      discountTotal
    }
    cart {
        needsShippingAddress
        chosenShippingMethod
        availableShippingMethods {
          packageDetails
          rates {
            cost
            id
            instanceId
            label
            methodId
          }
          supportsShippingCalculator
        }
    }
  }
`;

export default GET_CART;
