import Layout from "@components/Layout";
import client from "@components/ApolloClient";
// import Link from 'next/link';
// import Product from "../../src/components/Product";
import { PRODUCTS_BY_CATEGORY_SLUG, PRODUCT_CATEGORIES_SLUGS } from "../../src/queries/product-by-category";
// import NESTED_PRODUCTS_AND_CATEGORIES_QUERY from "../../../src/queries/nested-products-and-categories";
import PRODUCTS_AND_CATEGORIES_QUERY from "../../src/queries/product-and-categories";
// import Skeleton from 'react-loading-skeleton';
// import "react-input-range/lib/css/index.css"
// import ShopProducts from "@components/shop/elements/ShopProducts";
// import useTranslation from 'next-translate/useTranslation'
import { PER_PAGE_FIRST, totalPagesCount } from '@utils/pagination';
import Breadcrumb from "@components/breadcrumb";
import Product from "../../src/components/ProductFromGrid";
import OrderSelect from "@components/shop/elements/OrderSelect"

import Pagination from '@components/pagination';

import ShopFilters from "@components/shop/elements/ShopFilters";
// import ShopFilter2 from "@components/shop/elements/ShopFilter2";


import axios from "axios"
import isEmpty from "lodash/isEmpty";

import { useRouter } from "next/router";

import { useState, useEffect } from "react";

export default function CategorySingle(props) {

    // console.log(props)

    const pagesCount = totalPagesCount(props?.pageInfo?.offsetPagination?.total ?? 0);

    // const { t, lang } = useTranslation("common")

    const router = useRouter()

    const { categorySlug, parentCategorySlug, products, productCategories, pageInfo, categoryAcf, nestProductCategories, filters, priceLimits } = props;

    const [productsListFt, setProductsListFt] = useState(products)

    const [pageInfos, setPageInfos] = useState(pageInfo);

    // If the page is not yet generated, this will be displayed
    // initially until getStaticProps() finishes running
    if (router.isFallback) {
        return <div>Loading...</div>
    }

    // console.log(props)

    useEffect(() => {
        setProductsListFt(props.products)
        setPageInfos(props.pageInfo)
    }, [router.query.categorySlug])


    return (
        <Layout productCategories={productCategories} nestProductCategories={nestProductCategories} >
            <Breadcrumb />
            <div className="product-categories-container container mx-auto py-12 md:py-12 px-4 xl:px-0" id="shop-section">
                <div className="flex flex-wrap">
                    <div className="w-full relative">
                        <div>
                            <OrderSelect />
                        </div>
                        <div class="flex flex-wrap">
                            <div className="w-full md:w-1/4">
                                <ShopFilters productCategories={productCategories} filters={filters} priceLimits={priceLimits} sidebar={true} />
                            </div>

                            <div className="w-full md:w-3/4">

                                <div className="product-categories shop-grid grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-8 relative">
                                    {(undefined !== productsListFt) && productsListFt?.length ? (
                                        productsListFt.map(product => <Product key={product?.id} product={product} categorySlug={categorySlug} details={true} bttn={true} loading={false} />)
                                    ) :
                                        ""
                                    }

                                    {/* {loading && Array.from(Array(6), (e, i) => (
                                        <div className="w-full p-4 md:p-0">
                                            <Skeleton height={300} />
                                            <Skeleton height={24} width={150} />
                                            <div>
                                                <Skeleton height={24} width={100} />
                                            </div>
                                        </div>
                                    ))} */}


                                </div>

                                <Pagination pagesCount={pagesCount} postName={`${categorySlug}`} />

                            </div>

                        </div>


                    </div>

                </div>
            </div>
        </Layout>
    )
};

export async function getStaticProps(context) {

    let slug = context.params.categorySlug

    const { data } = await client.query(({
        query: PRODUCTS_BY_CATEGORY_SLUG,
        variables: { slug: slug, offset: null }
    }));

    const constData = await client.query(({
        query: PRODUCTS_AND_CATEGORIES_QUERY,
    }));

    let payload = {
        category: slug
    }

    const filters = await axios.post(`https://aliomis.admin.w3vitals.com/wp-json/myplugin/v1/gatCategoryAttributes`, payload);

    // console.log(filters)

    let myFilters = {}

    if (filters?.data?.items) {
        Object.keys(filters?.data?.items).map((item, i) => {
            myFilters[item] = { ...filters?.data?.items[item] };
            let ttp = [];
            Array.isArray(filters?.data?.items[item]?.values) && filters?.data?.items[item].values.map((mv, y) => {
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                console.log(mv)
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                if (ttp.length === 0) {
                    ttp.push(mv)
                } else {
                    let flag = true;
                    ttp.map((trp) => {
                        if (trp.label === mv.label) {
                            flag = false;
                        }
                    })
                    if (flag) {
                        ttp.push(mv)
                    }
                }
            })

            myFilters[item].values = ttp;
        })
    }


    return {
        props: {
            productCategories: constData?.data?.productCategories ? constData.data.productCategories.nodes : [],
            products: data?.products?.edges || [],
            pageInfo: data?.products?.pageInfo || {},

            filters: myFilters || [],
            priceLimits: filters?.data?.priceLimits || [],
            categoryAcf: data?.products?.edges[0].node?.productCategories?.edges[0].node.categoryAcf || {},
            categoryName: data?.products?.edges[0].node?.productCategories?.edges[0].node?.name || '',
            categorySlug: slug || productCategories?.edges[1].node?.slug,
            parentCategorySlug: data?.products?.edges[0].node?.productCategories?.edges[0].node?.parent?.node?.slug || '',
        },
        revalidate: 10
    }

}

export async function getStaticPaths({ locales }) {
    const { data } = await client.query({
        query: PRODUCT_CATEGORIES_SLUGS
    })

    const pathsData = []

    data?.productCategories?.nodes && data?.productCategories?.nodes.map((productCategory) => {
        if (!isEmpty(productCategory?.slug) && productCategory?.slug !== "uncategorized") {
            pathsData.push({
                params: { categorySlug: productCategory?.slug, chosenCategory: productCategory },
            })
        }
    })

    return {
        paths: pathsData,
        fallback: true
    }
}
