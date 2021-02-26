import Layout from '../../src/components/Layout';
import { useRouter } from 'next/router';
import { useState } from 'react'
import client from '../../src/components/ApolloClient';
import AddToCartButton from '../../src/components/cart/AddToCartButton';
import { PRODUCT_BY_SLUG_QUERY, PRODUCT_SLUGS } from '../../src/queries/product-by-slug';
import PRODUCTS_AND_CATEGORIES_QUERY from "../../src/queries/product-and-categories";
import Breadcrumb from "@components/breadcrumb";

import { isEmpty } from 'lodash';
import GalleryCarousel from "../../src/components/single-product/gallery-carousel";
import Price from "../../src/components/single-product/price";
import ProductView from "../../src/components/Product";
import StarRatings from 'react-star-ratings';



export default function Product(props) {
    const { product, productCategories } = props;

    console.log(props)

    const [quantity, setQuantity] = useState(1)
    const [activeTab, setActiveTab] = useState(1)
    const [activeTabContent, setActiveTabContent] = useState(product?.description)



    const router = useRouter()

    // If the page is not yet generated, this will be displayed
    // initially until getStaticProps() finishes running
    if (router.isFallback) {
        return <div>Loading...</div>
    }

    function changeQuantity(type) {
        if (type === "down" && quantity > 1) {
            setQuantity(quantity - 1)
        }


        // -------------------------- Start: Check for stock Availability ------------------------------------//
        if (type === "up") {
            setQuantity(quantity + 1)
        }
    }

    function changeTab(tab, content) {
        setActiveTab(tab)
        setActiveTabContent(content)
    }

    return (
        <Layout productCategories={productCategories}>
            <Breadcrumb />
            { product ? (
                <div className="single-product container mx-auto my-24 px-4 xl:px-0">
                    {console.log(props)}
                    <div className="block sm:grid md:grid-cols-2 gap-4">
                        <div className="product-images">

                            {!isEmpty(product?.galleryImages?.nodes) ? (
                                <GalleryCarousel gallery={product?.galleryImages?.nodes} />
                            ) : !isEmpty(product.image) ? (
                                <img
                                    src={product?.image?.sourceUrl}
                                    alt="Product Image"
                                    width="100%"
                                    height="auto"
                                    srcSet={product?.image?.srcSet}
                                />
                            ) : null}
                        </div>
                        <div className="product-info pl-0 pt-4 md:pt-0 md:pl-8">
                            <h1 className="product-h1">{product.name}</h1>
                            <div className="relative">
                                <StarRatings
                                    rating={product?.averageRating}
                                    starRatedColor="#8e9b6f"
                                    starDimension="20px"
                                    numberOfStars={5}
                                    name='rating'
                                />
                            </div>
                            <Price salesPrice={product?.price} regularPrice={product?.regularPrice} txtAlign="text-left pt-2" />
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: product.shortDescription,
                                }}
                                className="product-description mb-4"
                            />
                            <div className="flex flex-wrap">
                                <div className="flex justify-around mr-4 mt-4 items-center text-center" style={{ border: "1px solid #ddd", width: "180px", fontSize: "24px", color: "black", minHeight: "42px" }}>
                                    <div className="cursor-pointer w-1/3" style={{ borderRight: "1px solid lightgray" }} onClick={() => changeQuantity("down")}>-</div>
                                    <div className="w-1/3" style={{ fontFamily: `"EB Garamond",serif` }}>{quantity}</div>
                                    <div className="cursor-pointer w-1/3" style={{ borderLeft: "1px solid lightgray" }} onClick={() => changeQuantity("up")}>+</div>
                                </div>
                                {
                                    !product?.stockQuantity
                                        ?
                                        <div className="flex items-center">
                                            Out Of Stock
                                        </div>
                                        :
                                        <AddToCartButton product={product} quantity={quantity} />
                                }
                            </div>

                        </div>
                    </div>

                    <div className="pb-12 pt-20">
                        <div className="flex flex-wrap w-full justify-center" style={{ borderBottom: "1px solid lightgray" }}>
                            <div onClick={() => changeTab(1, product?.description)} className={`pb-2 w-full pt-4 md:pt-0 md:w-auto mr-8 pr-tab cursor-pointer ${activeTab === 1 && ("pr-tab-selected")}`}>DESCRIPTION</div>
                            {product?.brands?.edges.length > 0 && (
                                <div onClick={() => changeTab(2, product?.brands?.edges[0].node.description)} className={`pb-2 pt-4 md:pt-0 w-full md:w-auto mr-8 pr-tab cursor-pointer ${activeTab === 2 && ("pr-tab-selected")}`}>PRODUCER</div>
                            )}
                            <div onClick={() => changeTab(3, "<p></p>")} className={`pb-2 w-full pt-4 md:pt-0 md:w-auto mr-8 pr-tab cursor-pointer ${activeTab === 3 && ("pr-tab-selected")}`}>ADDITIONAL INFORMATION</div>
                        </div>
                        {activeTab === 3 && (
                            <div className="flex overflow-auto">
                                <table class="rounded-t-lg m-5 mx-auto text-gray-800 w-auto" style={{ minWidth: "400px" }}>
                                    {product?.productAcf?.additionalInformation?.row && product.productAcf.additionalInformation.row.map((row, i) => (
                                        <tr key={`cr-${i}`} class="text-left border-b-2" style={i === 0 ? { backgroundColor: "#c9d3a7" } : { borderColor: "#c9d3a75c" }}>
                                            {row && row.col.map((col, y) => {
                                                if (i === 0) {
                                                    return (
                                                        <th key={`ct-${y}`} class="px-4 py-3">{col.entry}</th>
                                                    )
                                                } else {
                                                    return (
                                                        <td key={`ct-${y}`} class="px-4 py-3">{col.entry}</td>
                                                    )
                                                }
                                            })}
                                        </tr>
                                    ))}
                                </table>
                            </div>
                        )}
                        <div>
                            <div className="pt-8" dangerouslySetInnerHTML={{ __html: activeTabContent }} />
                        </div>
                    </div>
                    {(undefined !== product.upsell.edges) && product.upsell.edges?.length && (
                        <div className="py-12">
                            <div>
                                <h2 className="product-h1 text-center mb-10 w-full" style={{ fontSize: "29px", letterSpacing: ".2em" }}>CUSTOMERS ALSO SAW</h2>
                            </div>
                            <div className="product-categories flex flex-wrap justify-center grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-8 relative">
                                {(undefined !== product.upsell.edges) && product.upsell.edges?.length && (
                                    product.upsell.edges.map(product => <ProductView key={`upsell-${product?.node?.id}`} product={product?.node} categorySlug={product?.node?.productCategories?.edges[0].node.slug} loading={false} />)
                                )}
                            </div>
                        </div>
                    )}
                    <div className="py-12">
                        <div>
                            <h2 className="product-h1 text-center mb-10 w-full" style={{ fontSize: "29px", letterSpacing: ".2em" }}>RELATED PRODUCTS</h2>
                        </div>
                        <div className="product-categories flex flex-wrap justify-center sm:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-8 relative">
                            {(undefined !== product.related.edges) && product.related.edges?.length && (
                                product.related.edges.map(product => <ProductView key={`related-${product?.node?.id}`} product={product?.node} categorySlug={product?.node?.productCategories?.edges[0].node.slug} loading={false} />)
                            )}
                        </div>
                    </div>

                </div>
            ) : (
                    ''
                )}
        </Layout>
    );
};


export async function getStaticProps(context) {

    const { params: { slug } } = context

    const { data } = await client.query({
        query: PRODUCT_BY_SLUG_QUERY,
        variables: { slug }
    })

    const productCategories = await client.query({
        query: PRODUCTS_AND_CATEGORIES_QUERY,
    });

    return {
        props: {
            productCategories: productCategories?.data?.productCategories?.nodes ? productCategories.data.productCategories.nodes : [],
            product: data?.product || {},
        },
        revalidate: 1
    };
}

export async function getStaticPaths() {
    const { data } = await client.query({
        query: PRODUCT_SLUGS
    })


    const pathsData = []

    data?.productCategories?.edges && data?.productCategories?.edges.map((productCat) => {
        if (!isEmpty(productCat?.node?.slug)) {
            productCat?.node?.products?.edges && productCat?.node?.products?.edges.map((product) => {
                pathsData.push({ params: { slug: product?.node?.slug, categorySlug: productCat?.node?.slug } })
            })
        }
    })

    return {
        paths: pathsData,
        fallback: false
    }
}
