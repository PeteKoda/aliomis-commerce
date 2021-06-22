import Layout from "../../src/components/Layout";
import client from "../../src/components/ApolloClient";
import { gql } from "@apollo/client";
import Link from 'next/link';
import Modal from 'react-modal';
import Product from "../../src/components/Product";
import { PRODUCT_BY_CATEGORY_SLUG, PRODUCT_CATEGORIES_SLUGS, PRODUCT_BY_CATEGORY_SLUG_ENDPOINT, PRODUCT_BY_CATEGORY_SLUG_ENDPOINT_BEFORE } from "../../src/queries/product-by-category";
import PRODUCTS_AND_CATEGORIES_QUERY from "../../src/queries/product-and-categories";
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import Skeleton from 'react-loading-skeleton';
import "react-input-range/lib/css/index.css"
import InputRange from 'react-input-range';
import Select from 'react-select'

import Breadcrumb from "@components/breadcrumb";

import GET_CATEGORIES_QUERY from "../../src/queries/get-categories";

import isEmpty from "lodash/isEmpty";

import { useRouter } from "next/router";

import { useState, useEffect } from "react";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: "100%",
        zIndex: "99999999999999",
        height: "80vh",
        overflow: "scroll",
        padding: "0px"
    }
};

const options = [
    { value: 'POPULAR', label: 'Populaire' },
    { value: 'DATE', label: 'Nouveautés ' },
    { value: 'PRICE', label: 'Prix croissant' },
    { value: 'PRICE2', label: 'Prix décroissant' },
    { value: 'TOTAL_SALES', label: 'Meilleures ventes' }
]

// const dot = (color = '#ccc') => ({
//     alignItems: 'center',
//     display: 'flex',

//     ':before': {
//         backgroundColor: color,
//         borderRadius: 10,
//         content: '" "',
//         display: 'block',
//         marginRight: 8,
//         height: 10,
//         width: 10,
//     },
// });

const colourStyles = {
    menu: (provided, state) => ({
        ...provided,
        width: "200px",
        padding: 10,
        zIndex: 9,
        outline: "none"
    }),
    control: styles => ({ ...styles, backgroundColor: 'white', width: "200px" }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        return {
            ...styles,
            cursor: "pointer",
            backgroundColor: isSelected ? "#9da77c" : isFocused ? "#f7f7f7" : "transparent",
            color: isSelected ? "white" : isFocused ? "black" : "#8b8b8b",
        };
    },
    input: styles => ({ ...styles }),
    placeholder: styles => ({ ...styles }),
    singleValue: (styles, { data }) => ({ ...styles }),
};


export default function CategorySingle(props) {

    const router = useRouter()

    const updateQuery = (slug, newQuery, pageNum) => {
        router.push({
            pathname: `/${slug}/`,
            query: { search: encodeURI(newQuery), page: pageNum },
        }, undefined, { shallow: true });
    };

    const updateQueryFilters = ({ queryParams, slug }) => {
        router.push({
            pathname: `/${slug}/`,
            query: {
                ...queryParams
            },
        }, undefined, { shallow: true });
    };

    const [firstRender, setFirstRender] = useState(true)

    const { categorySlug, products, productCategories, pageInfo, categoryAcf } = props;

    const [productsList, setProductsList] = useState(products);

    const [pageInfos, setPageInfos] = useState(pageInfo);

    const [pageNumber, setPageNumber] = useState(1);

    const [order, setOrder] = useState("DATE");

    const [loading, setLoading] = useState(false)

    const [searchIn, setSearchIn] = useState("")

    const [isOpen, setIsOpen] = useState(false);

    const [priceVal, setPriceVal] = useState({ min: (categoryAcf && categoryAcf.priceRange.priceMin) ? parseFloat(categoryAcf.priceRange.priceMin) : 0, max: (categoryAcf && categoryAcf.priceRange.priceMax) ? parseFloat(categoryAcf.priceRange.priceMax) : 100 });

    const [selectInputOption, setSelectInputOption] = useState(options[0])

    // If the page is not yet generated, this will be displayed
    // initially until getStaticProps() finishes running
    if (router.isFallback) {
        return <div>Loading...</div>
    }

    useEffect(() => {
        console.log(props)

        if (window.location.search !== "") {
            addBrandFilter()
        }
        setFirstRender(false)

        return () => {
            clearAllBodyScrollLocks();
        };
    }, [])

    useEffect(() => {
        let body = document.getElementsByTagName("BODY")[0];
        if (isOpen) {
            setTimeout(() => {
                disableBodyScroll(body)
            }, [1000])
        } else {
            enableBodyScroll(body)
        }
    }, [isOpen])

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        let search = urlParams.get('search');

        if (!search) {
            setProductsList(props.products)
            setPriceVal({ min: (categoryAcf && categoryAcf.priceRange.priceMin) ? parseFloat(categoryAcf.priceRange.priceMin) : 0, max: (categoryAcf && categoryAcf.priceRange.priceMax) ? parseFloat(categoryAcf.priceRange.priceMax) : 100 })
            setPageInfos(props.pageInfo)
        } else {
            addBrandFilter()
        }
    }, [router.query.categorySlug])

    //-- Reset Products To Default --//

    useEffect(() => {
        if (!firstRender) {
            if (!window.location.search) {
                console.log("Reset store")
                setProductsList(props.products)
            }
        }
    }, [router.query])


    //-/- Reset Products To Default --//


    // useEffect(() => {
    //     console.log("Page Infos: ")
    //     console.log(pageInfos)
    //     console.log("////////////////////////////")
    // }, [pageInfos])

    // async function goToPaginationCursor(endCursor) {
    //     const { data } = await client.query(({
    //         query: PRODUCT_BY_CATEGORY_SLUG_ENDPOINT,
    //         variables: { slug: categorySlug, endPoint: endCursor }
    //     }));
    //     if (data.productCategory) {
    //         setProductsList(data.productCategory.products.nodes)
    //         setPageInfos(data.productCategory.products.pageInfo)
    //     }
    // }

    async function goToNextPage() {
        let el = document.getElementById("shop-section")
        el.scrollIntoView();
        addBrandFilter(pageInfos.endCursor, "", "endPoint", "")
    }

    async function goToPreviousPage() {
        let el = document.getElementById("shop-section")
        el.scrollIntoView();
        addBrandFilter(pageInfos.startCursor, "", "startPoint", "")
    }

    async function searchWithFilters({ terms, attribute, attributeTerm, categorySlug, tags, type, price, startPoint, endPoint, order, field, search }) {

        console.log(terms, attribute, attributeTerm, categorySlug, tags, type, price)

        let whereTags = []

        if (tags) {
            tags.map((tg) => {
                whereTags.push(`{and: {terms: ["${tg}"], taxonomy: PRODUCTTAG}}`)
            })
        }

        whereTags = whereTags.join()

        let dynamicBrand = terms ? `{and:{terms: ${JSON.stringify(terms)} , taxonomy: BRAND}}` : ""

        let dynamicType = type ? `{and:{terms: ${JSON.stringify(type)} , taxonomy: SPECIFICTYPE}}` : ""

        let dynamicWhere = (terms || tags || type) ? `,taxonomyFilter:[ ${dynamicBrand} ${whereTags} ${dynamicType}]` : ""

        let dynamicPrice = price ? `minPrice: ${price[0].min}, maxPrice: ${price[0].max}` : ""

        const myQuery = gql` query PRODUCT_BY_FILTERS($first: Int, $last: Int ,$categorySlug: String, $attribute: String, $attributeTerm: String, $endPoint: String!, $startPoint: String!, $field: ProductsOrderByEnum!, $order: OrderEnum, $search: String ) {
            products( first: $first, last: $last, after: $endPoint, before: $startPoint , where: { search: $search,orderby: {field: $field, order: $order} ,attribute: $attribute, attributeTerm: $attributeTerm ,category: $categorySlug ${dynamicWhere} ${dynamicPrice} }) {
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
        `

        const { data } = await client.query(({
            query: myQuery,
            variables: {
                attribute: attribute ? attribute : null,
                attributeTerm: attributeTerm ? attributeTerm : null,
                categorySlug: categorySlug ? categorySlug : null,
                startPoint: startPoint ? startPoint : "",
                endPoint: endPoint ? endPoint : "",
                first: (endPoint || !startPoint) ? 24 : null,
                last: startPoint ? 24 : null,
                field: field ? field : `DATE`,
                order: order ? getListOrder(order, startPoint) : (startPoint ? `ASC` : `DESC`),
                search: search ? search : ""
            }
        }));

        function getListOrder(order, startPoint) {
            let tOrder;
            if (startPoint) {
                if (order === `DESC`) {
                    tOrder = `ASC`
                } else {
                    tOrder = `DESC`
                }

            } else {
                tOrder = order
            }
            return tOrder;
        }


        if (startPoint) {
            setPageInfos({
                endCursor: data.products.pageInfo.startCursor,
                startCursor: data.products.pageInfo.endCursor,
                hasNextPage: data.products.pageInfo.hasNextPage,
                hasPreviousPage: data.products.pageInfo.hasPreviousPage,

            })
        } else {
            setPageInfos(data.products.pageInfo)
        }

        let tmp = [...data.products.nodes]

        tmp = startPoint ? tmp.reverse() : tmp

        setProductsList(tmp)

        let queryParams = {};

        if (tags && Array.isArray(tags)) {
            queryParams.tags = tags.join(",")
        } else if (tags) {
            queryParams.tags = tags
        }

        if (attribute) {
            queryParams.attribute = attribute
        }
        if (attributeTerm) {
            queryParams.attributeTerm = attributeTerm
        }

        if (type) {
            queryParams.type = type
        }

        if (terms && Array.isArray(terms)) {
            queryParams.terms = terms.join(",")
        } else if (terms) {
            queryParams.terms = terms
        }

        if (price) {
            queryParams.maxPrice = price[0].max
            queryParams.minPrice = price[0].min
        }

        if (endPoint) {
            queryParams.endPoint = endPoint
        }

        if (startPoint) {
            queryParams.startPoint = startPoint
        }

        if (search) {
            queryParams.search = search
        }

        if (order) {
            queryParams.order = order
            queryParams.field = field
        }

        updateQueryFilters({
            queryParams,
            slug: router.query.categorySlug
        })

        setLoading(false)

    }

    function onChangeSearch(e) {
        if (e.key === "Enter") {
            addBrandFilter(e.target.value, "", "search", "")
        }
    }

    function addBrandFilter(brand, i, type, tpClass) {

        setLoading(true)

        console.log(brand, i, type, tpClass)

        let brands = [];

        let pr = {}

        pr.categorySlug = router.query.categorySlug;

        let brandLi = document.getElementsByClassName(tpClass);

        let urlParams = new URLSearchParams(window.location.search);
        let terms = urlParams.get([type]);

        //---------- Start: Hydrate query params with search state ---------------------||

        if (type !== "tags") {
            if (urlParams.get("tags")) {
                pr.tags = urlParams.get("tags")
                pr.tags = pr.tags.split(",")

                if (!i) {
                    let allTags = document.querySelectorAll(".all-tags")
                    console.log(allTags)
                    pr.tags.map((tag, t) => {
                        Array.from(allTags).map(elem => {
                            console.log(elem.innerHTML);
                            if (tag === elem.innerHTML) {
                                elem.style.color = "#96a854";
                                elem.style.textDecoration = "underline";
                            }
                        })
                        console.log(tag)
                    })
                }

            }
        }

        if (type !== "attribute") {
            if (urlParams.get("attribute")) {
                pr.attribute = urlParams.get("attribute")

                //---------- Need Work: Need Work To Make Refresh With Active Css ---------------------||

            }
        }

        if (type !== "attributeTerm") {
            if (urlParams.get("attributeTerm"))
                pr.attributeTerm = urlParams.get("attributeTerm")
        }

        if (type !== "search") {
            if (urlParams.get("search")) {
                pr.search = urlParams.get("search")
                setSearchIn(pr.search)
            }
        } else {
            console.log(brand)
            pr.search = brand
            brand = ""
        }

        if (type !== "terms") {
            if (urlParams.get("terms")) {
                pr.terms = urlParams.get("terms")
                pr.terms = pr.terms.split(",")
            }
        }

        if (type !== "type") {
            if (urlParams.get("type")) {
                pr.type = urlParams.get("type")

                if (!i) {
                    alert("inside")
                    let allTypes = document.querySelectorAll(".types-li")
                    console.log()
                    console.log(pr.type)

                    Array.from(allTypes).map(elem => {
                        console.log(elem.innerHTML);
                        if (pr.type === elem.innerHTML) {
                            elem.style.color = "#96a854";
                            elem.style.textDecoration = "underline";
                        }
                    })
                }

            }

        } else {
            if (urlParams.get("type")) {
                pr.type = ""
            }
        }

        if (type !== "endPoint") {
            if (urlParams.get("endPoint") && type !== "startPoint")
                pr.endPoint = urlParams.get("endPoint")
        } else {
            console.log(brand)
            pr.endPoint = brand
            brand = ""
        }

        if (type !== "startPoint") {
            if (urlParams.get("startPoint") && type !== "endPoint")
                pr.startPoint = urlParams.get("startPoint")
        } else {
            console.log(brand)
            pr.startPoint = brand
            brand = ""
        }

        if ([type] !== "price") {
            if (urlParams.get("minPrice")) {
                pr.price = [{
                    min: urlParams.get("minPrice"),
                    max: urlParams.get("maxPrice")
                }]
            }
        }

        if (type !== "order") {
            if (urlParams.get("order")) {
                pr.order = urlParams.get("order")
                if (pr.order === "DESC" && urlParams.get("field") === "PRICE") {
                    setSelectInputOption(options[2])
                } else if (pr.order === "ASC" && urlParams.get("field") === "PRICE") {
                    setSelectInputOption(options[1])
                }
            }
            if (urlParams.get("field")) {
                pr.field = urlParams.get("field")
                if (pr.field === "DATE") {
                    setSelectInputOption(options[0])
                } else if (pr.field === "TOTAL_SALES") {
                    setSelectInputOption(options[3])
                }
            }



            // const options = [
            //     { value: 'DATE', label: 'Latest' },
            //     { value: 'PRICE', label: 'Price Ascending' },
            //     { value: 'PRICE2', label: 'Price Descending' },
            //     { value: 'TOTAL_SALES', label: 'Best Sellers' }
            // ]

        } else {
            if (pr["startPoint"])
                delete pr["startPoint"]
            if (pr["endPoint"])
                delete pr["endPoint"]
            console.log(brand)
            pr.order = brand.order
            pr.field = brand.field
            brand = ""
        }

        //---------- End: Hydrate query params with search state ---------------------||


        if (terms) {
            let tm = terms.split(",")
            tm.map((br) => {
                console.log(br)
                brands.push(br)
            })
        }

        if (brand) {

            //---------- Start: Reset cursors after filter change ---------------------||

            if (type !== "startPoint" && type !== "endPoint") {
                if (pr["startPoint"])
                    delete pr["startPoint"]
                if (pr["endPoint"])
                    delete pr["endPoint"]
            }

            //---------- End: Reset cursors after filter change ---------------------||

            if (terms && brands.includes(brand)) {
                console.log(brands)
                brands = brands.filter(item => item !== brand)
                console.log(brands)
                if (i !== "") {
                    brandLi[i].style.color = "#8b8b8b";
                    brandLi[i].style.textDecoration = "unset";
                }
            } else {
                brands.push(brand)
                if (i !== "") {
                    brandLi[i].style.color = "#96a854";
                    brandLi[i].style.textDecoration = "underline";
                }
            }

            if (brands && brands.length > 0) {
                if (type === "type" && (brands && brands.length > 1)) {
                    brands = brands.pop();
                    let elements = Array.from(brandLi);
                    elements.map((li) => {
                        li.style.color = "#8b8b8b";
                        li.style.textDecoration = "unset";
                    })
                    brandLi[i].style.color = "#96a854";
                    brandLi[i].style.textDecoration = "underline";
                }
                pr[type] = brands;
            } else {
                delete pr[type]
            }
        } else {

            //---------- Start: Initialize price from query search ---------------------||

            if (urlParams.get("minPrice")) {
                setPriceVal({
                    min: parseFloat(urlParams.get("minPrice")),
                    max: parseFloat(urlParams.get("maxPrice"))
                })
            }

            //---------- End: Initialize price from query search ---------------------||
        }

        searchWithFilters({ ...pr })
    }

    function closeModal() {
        setIsOpen(false);
    }

    function applyFilterChanges() {

        if (priceVal.min !== categoryAcf.priceRange.priceMin || priceVal.max !== categoryAcf.priceRange.priceMax) {
            addBrandFilter(priceVal, "", "price", "price-li")
        }

        closeModal()
    }

    function handleChange(selectedOption) {
        setSelectInputOption({ ...selectedOption })

        setOrder(selectedOption.value)
        if (selectedOption.value === "POPULAR") {
            addBrandFilter({ order: "ASC", field: "MENU_ORDER" }, "", "order", "")
        }
        else if (selectedOption.value === "DATE") {
            addBrandFilter({ order: "DESC", field: "DATE" }, "", "order", "")
        } else if (selectedOption.value === "PRICE") {
            addBrandFilter({ order: "ASC", field: "PRICE" }, "", "order", "")
        } else if (selectedOption.value === "PRICE2") {
            addBrandFilter({ order: "DESC", field: "PRICE" }, "", "order", "")
        } else if (selectedOption.value === "TOTAL_SALES") {
            addBrandFilter({ order: "DESC", field: "TOTAL_SALES" }, "", "order", "")
        }

        console.log(`Option selected:`, selectedOption);
    };

    return (
        <Layout productCategories={productCategories}>
            <Breadcrumb />
            <div className="product-categories-container container mx-auto py-12 md:py-20 px-4 xl:px-0" id="shop-section">
                <div className="flex flex-wrap">

                    <div className=" w-full md:w-1/4 hidden md:block">
                        <div className="mb-8 flex">
                            <img src="/search.svg" onClick={() => addBrandFilter(searchIn, "", "search", "")} className={"pb-1 pr-1"} style={{ borderBottom: "1px solid lightgrey" }} />
                            <input type="text" value={searchIn} onKeyPress={onChangeSearch} onChange={(e) => setSearchIn(e.target.value)} placeholder="Rechercher" className="search-input" />
                        </div>
                        <div>
                            <h3 className="categories-filter">CATEGORIES</h3>
                            <ul className="mt-2">
                                {(productCategories && productCategories.length > 0) && productCategories.map((cat, i) => (
                                    <li key={`filter-cat-${i}`} className="filter-cat-li">
                                        <Link href={`/${cat.slug}/`} >
                                            <a style={cat.slug === categorySlug ? { textDecoration: "underline", color: "#96a854" } : { textDecoration: "unset" }}>
                                                {cat.name}
                                            </a>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/*-------------------   To be fixed if attributes are used  --------------------------------*/}

                        {/* {(categoryAcf.categoryAttributes && categoryAcf.categoryAttributes.length > 0) && (
                            <div className="mt-8">
                                <h3 className="categories-filter">ATTRIBUTES</h3>
                                <div className="mt-2">
                                    {categoryAcf.categoryAttributes.map((attr, i) => (
                                        <div key={`attr-cat-${i}`} className="filter-cat-li">
                                            {attr.label}
                                            {attr.attributes && attr.attributes.length > 0 && attr.attributes.map((at, j) => (
                                                <div onClick={() => addAttributeFilter(at)} key={`inner-attr-${j}`}>
                                                    {at.attributeGroup.attributeTermLabel}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )} */}

                        {/*-------------------   To be fixed if attributes are used  --------------------------------*/}


                        {(categoryAcf.categoryTags && categoryAcf.categoryTags.length > 0) && (
                            <div>
                                {categoryAcf.categoryTags.map((tag, i) => (
                                    <div key={`tag-cat-${i}`} className="filter-cat-li mt-8">
                                        <h3 className="categories-filter">{tag.label}</h3>
                                        <div className="mt-2">
                                            {tag.tags && tag.tags.length > 0 && tag.tags.map((at, j) => (
                                                <div onClick={() => addBrandFilter(at.name, j, "tags", `tags-li-${i}`)} className={`tags-li-${i} all-tags`} key={`inner-tag-${j}`}>
                                                    {at.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {(categoryAcf.categoryBrands && categoryAcf.categoryBrands.length > 0) && (
                            <div className="mt-8">
                                <h3 className="categories-filter">Producteurs</h3>
                                <div className="mt-2">
                                    {categoryAcf.categoryBrands.map((tag, i) => (
                                        <div onClick={() => addBrandFilter(tag.name, i, "terms", "brand-li")} key={`brand-${i}`} className="filter-cat-li brand-li">
                                            {tag.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(categoryAcf.categoryTypes && categoryAcf.categoryTypes.length > 0) && (
                            <div className="mt-8">
                                <h3 className="categories-filter">Types</h3>
                                <div className="mt-2">
                                    {categoryAcf.categoryTypes.map((tag, i) => (
                                        <div onClick={() => addBrandFilter(tag.name, i, "type", "types-li")} key={`types-${i}`} className="filter-cat-li types-li">
                                            {tag.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-8" style={{ maxWidth: "195px" }}>
                            <h3 className="categories-filter mb-6">Prix</h3>

                            <InputRange
                                maxValue={(categoryAcf && categoryAcf.priceRange.priceMax) ? categoryAcf.priceRange.priceMax : 100}
                                minValue={(categoryAcf && categoryAcf.priceRange.priceMin) ? categoryAcf.priceRange.priceMin : 0}
                                value={priceVal}
                                onChange={value => setPriceVal(value)}
                                minLabel=""
                                maxLabel=""
                            />


                            <button className="bttn-default mt-8 ml-auto mr-auto" onClick={() => addBrandFilter(priceVal, "", "price", "price-li")}>Appliquer</button>
                        </div>

                    </div>

                    <div className="w-full md:w-3/4">

                        <div className="flex justify-between md:justify-end mb-8">
                            <div className="block md:hidden">
                                <button
                                    className="p-2"
                                    style={{
                                        border: "1px solid #808080",
                                        borderRadius: "5px",
                                        padding: "6px",
                                        color: "#333333",
                                        paddingTop: "3px",
                                        paddingBottom: "3px"
                                    }}
                                    onClick={() => setIsOpen(true)}
                                >
                                    Show Filters
                                </button>
                            </div>
                            <div>
                                <Select
                                    value={selectInputOption}
                                    onChange={handleChange}
                                    label="Single select"
                                    options={options}
                                    styles={colourStyles}
                                    classNamePrefix={"kd"}
                                    inputProps={{ readOnly: true }}
                                    isSearchable={false}
                                />

                                {/* <Select options={options} styles={customSelect} width='200px' /> */}
                            </div>
                        </div>

                        <div className="product-categories shop-grid grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-8 relative">
                            {(undefined !== productsList && !loading) && productsList?.length ? (
                                productsList.map(product => <Product key={product?.id} product={product} categorySlug={categorySlug} details={true} bttn={true} loading={loading} />)
                            ) : (!loading
                                ?
                                <div className="top-0 absolute flex items-center justify-center w-full" style={{ minHeight: "230px", fontSize: "1.5rem", color: "#adadad" }}>
                                    No products available with these filters
                                </div>
                                :
                                ""
                                )
                            }

                            {loading && Array.from(Array(6), (e, i) => (
                                <div className="w-full p-4 md:p-0">
                                    <Skeleton height={300} />
                                    <Skeleton height={24} width={150} />
                                    <div>
                                        <Skeleton height={24} width={100} />
                                    </div>
                                </div>
                            ))}


                        </div>
                        <div className="flex justify-center mt-5">
                            {pageInfos?.hasPreviousPage && (
                                <button className="bttn-page-nav" onClick={() => goToPreviousPage()}>
                                    <img src="/chevron-right.svg" />
                                </button>
                            )}
                            {pageInfos?.hasNextPage && (

                                <button className="bttn-page-nav bttn-next-page" onClick={() => goToNextPage()}>
                                    <img src="/chevron-right.svg" className="relative" style={{ left: "-1px" }} />
                                </button>
                            )}
                        </div>

                    </div>

                </div>

            </div>

            <Modal
                isOpen={isOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div className="w-full">
                    <div className="flex justify-between p-4 relative top-0" style={{ boxShadow: "rgb(33 35 38 / 10%) 0px 10px 10px -10px" }}>
                        <div>Filters</div>
                        <div onClick={closeModal}>x</div>
                    </div>
                    <div className="px-6" style={{ height: "50vh", overflowY: "scroll" }}>
                        <div className="mb-8 mt-4 flex">
                            <img src="/search.svg" onClick={() => addBrandFilter(searchIn, "", "search", "")} className={"pb-1 pr-1"} style={{ borderBottom: "1px solid lightgrey" }} />
                            <input type="text" value={searchIn} onKeyPress={onChangeSearch} onChange={(e) => setSearchIn(e.target.value)} placeholder="Search" className="search-input" />
                        </div>
                        <div>
                            <h3 className="categories-filter">CATEGORIES</h3>
                            <ul className="mt-2">
                                {(productCategories && productCategories.length > 0) && productCategories.map((cat, i) => (
                                    <li key={`filter-cat-${i}`} className="filter-cat-li">
                                        <Link href={`/${cat.slug}/`} >
                                            <a style={cat.slug === categorySlug ? { textDecoration: "underline", color: "#96a854" } : { textDecoration: "unset" }}>
                                                {cat.name}
                                            </a>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {(categoryAcf.categoryTags && categoryAcf.categoryTags.length > 0) && (
                            <div >
                                {categoryAcf.categoryTags.map((tag, i) => (
                                    <div key={`tag-cat-${i}`} className="filter-cat-li mt-8 pt-4" style={{ borderTop: "1px solid lightgrey" }}>
                                        <h3 className="categories-filter">{tag.label}</h3>
                                        <div className="mt-2">
                                            {tag.tags && tag.tags.length > 0 && tag.tags.map((at, j) => (
                                                <div onClick={() => addBrandFilter(at.name, j, "tags", `tags-li-${i}`)} className={`tags-li-${i} all-tags`} key={`inner-tag-${j}`}>
                                                    {at.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {(categoryAcf.categoryBrands && categoryAcf.categoryBrands.length > 0) && (
                            <div className="mt-8 pt-4" style={{ borderTop: "1px solid lightgrey" }}>
                                <h3 className="categories-filter">Brands</h3>
                                <div className="mt-2">
                                    {categoryAcf.categoryBrands.map((tag, i) => (
                                        <div onClick={() => addBrandFilter(tag.name, i, "terms", "brand-li")} key={`brand-${i}`} className="filter-cat-li brand-li">
                                            {tag.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(categoryAcf.categoryTypes && categoryAcf.categoryTypes.length > 0) && (
                            <div className="mt-8 pt-4" style={{ borderTop: "1px solid lightgrey" }}>
                                <h3 className="categories-filter">Types</h3>
                                <div className="mt-2">
                                    {categoryAcf.categoryTypes.map((tag, i) => (
                                        <div onClick={() => addBrandFilter(tag.name, i, "type", "types-li")} key={`types-${i}`} className="filter-cat-li types-li">
                                            {tag.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-8 pt-4" style={{ borderTop: "1px solid lightgrey" }}>
                            <h3 className="categories-filter mb-6">Prix</h3>

                            <InputRange
                                maxValue={(categoryAcf && categoryAcf.priceRange.priceMax) ? categoryAcf.priceRange.priceMax : 100}
                                minValue={(categoryAcf && categoryAcf.priceRange.priceMin) ? categoryAcf.priceRange.priceMin : 0}
                                value={priceVal}
                                onChange={value => setPriceVal(value)} />
                            {/* <button className="bttn-default mt-8 ml-auto mr-auto" onClick={() => addBrandFilter(priceVal, "", "price", "price-li")}>Apply</button> */}
                        </div>
                    </div>
                    <div>
                        <button className="bttn-default mt-8 ml-auto mr-auto" onClick={() => applyFilterChanges()}>Appliquer</button>
                    </div>
                </div>
            </Modal>

        </Layout>
    )
};

export async function getStaticProps(context) {

    console.log(context)

    let slug = context.params.categorySlug

    const { data } = await client.query(({
        query: PRODUCT_BY_CATEGORY_SLUG,
        variables: { slug }
    }));

    const constData = await client.query(({
        query: PRODUCTS_AND_CATEGORIES_QUERY,
    }));

    return {
        props: {
            productCategories: constData?.data?.productCategories ? constData.data.productCategories.nodes : [],
            categoryName: data?.productCategory?.name || '',
            categorySlug: data?.productCategory?.slug || '',
            products: data?.productCategory?.products?.nodes || [],
            pageInfo: data?.productCategory?.products?.pageInfo || {},
            categoryAcf: data?.productCategory?.categoryAcf || {}
        },
        revalidate: 60
    }

}

export async function getStaticPaths() {
    const { data } = await client.query({
        query: PRODUCT_CATEGORIES_SLUGS
    })

    const pathsData = []

    data?.productCategories?.nodes && data?.productCategories?.nodes.map((productCategory) => {
        if (!isEmpty(productCategory?.slug)) {
            pathsData.push({ params: { categorySlug: productCategory?.slug } })
        }
    })

    return {
        paths: pathsData,
        fallback: true
    }
}
