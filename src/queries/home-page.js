import { gql } from "@apollo/client";

const HOME_PAGE_QUERY = gql`
    query HOME_PAGE_QUERY ($id: ID!) {
        page (id: $id){
            title
            homePageAcf{
                intro{
                    h1
                    h2
                    backgroundImage{
                        altText
                        sourceUrl
                    }
                    backgroundMobileImage{
                        altText
                        sourceUrl
                    }
                    cta{
                        text
                        link
                    }
                }
                promo{
                    offersImage {
                        altText
                        sourceUrl
                    }
                    bestSellersImage {
                        altText
                        sourceUrl
                    }
                }
                aboutUs{
                    title
                    subTitle
                    description
                    cta{
                        text
                        link
                    }
                    image{
                        altText
                        sourceUrl
                    }
                }
                featured{
                    title
                    subTitle
                }
                clients{
                    image{
                        altText
                        sourceUrl
                    }
                    url
                }
            }
        }
        bestSellers: products(where: {orderby: {field: TOTAL_SALES}}, first: 3) {
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
                    productCategories{
                        edges{
                            node{
                                slug
                                name
                                uri
                            }
                        }
                    }
                }
            }
        }
        offers: products(where: {onSale: true}, first: 3) {
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
                    productCategories{
                        edges{
                            node{
                                slug
                                name
                                uri
                            }
                        }
                    }
                }
            }
        }
        featured: products(where: {featured: true}, first: 16) {
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
                    productCategories{
                        edges{
                            node{
                                slug
                                name
                                uri
                            }
                        }
                    }
                }
            }
        }
    }
`;

export default HOME_PAGE_QUERY;
