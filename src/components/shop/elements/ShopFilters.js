import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useState } from "react";
import { useWindowSize } from "@hooks";
// import { toCapitalize } from "@utils/toCapitalize";
// import SortBy from "@components/shop/elements/SortBy";
import ShopWidget from "@components/shop/elements/ShopWidget";
import { arrSortByCharacter, getClosest, range } from "@utils/method";
import InputRange from 'react-input-range';
import "react-input-range/lib/css/index.css"

// import ProductPerPage from "@components/shop/elements/ProductPerPage";



import React from "react";

const ShopFilters = (props) => {

    const {
        getFilterParam,
        productCategories,
        filters,
        priceLimits
    } = props;

    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);

    const [priceVal, setPriceVal] = useState({ min: router.query?.priceMin ? parseInt(router.query.priceMin) : parseInt(priceLimits.minPrice), max: router.query?.priceMax ? parseInt(router.query.priceMax) : parseInt(priceLimits.maxPrice) });

    console.log(props);

    const { query: { categorySlug } } = useRouter();


    const [windowSize] = useWindowSize();

    // const {filterBySize} = useFilter(products);
    // const sizes = getProductsUniqueSizes(products);
    // const colors = getProductsUniqueColors(products);
    // const vendors = getProductsUniqueVendor(products);
    // let priceRange = range(0, maxPrice, 50);
    // const tags = getProductsUniqueTags(products, 20);


    useEffect(() => {
        if (windowSize > 767) {
            setIsOpen(true)
        } else {
            setIsOpen(false)
        }
    }, [windowSize])

    const filterByHandler = (e) => {
        e.preventDefault();
        const target = e.target;
        const closest = getClosest(target, 'UL').childNodes;
        closest.forEach(elem => {
            if (elem.classList.contains('active')) {
                elem.classList.remove('active')
                target.parentNode.classList.add('active')
            } else {
                target.parentNode.classList.add('active')
            }
        })
        getFilterParam(target.dataset.filtertype, target.dataset.filtervalue);
    }

    function changePage(term, val) {

        let tmpVal = "";
        let tmpValRem = "";

        router.query.page = 1;


        if (router.query[term]) {
            if (router.query[term].includes(val)) {
                tmpValRem = router.query[term].split("-")
                let index = tmpValRem.indexOf(val);
                if (index !== -1) {
                    tmpValRem.splice(index, 1);
                }
                console.log(tmpValRem)
                tmpValRem.map((nv, i) => {
                    if (i === tmpValRem.length - 1) {
                        tmpVal = tmpVal + `${nv}`
                    } else {
                        tmpVal = tmpVal + `${nv}-`
                    }
                })

                if (tmpValRem === []) {
                    console.log("BGALTO")
                    delete router.query[term];
                }

            } else {
                console.log(router.query[term])
                tmpVal = router.query[term] + "-" + val
            }
        } else {
            tmpVal = val
        }


        router.push({
            pathname: '/[categorySlug]' + "/filter",
            query: { ...router.query, [term]: tmpVal },
        }, undefined, { shallow: false, locale: router.locale });
    }

    function changePrice(min, max) {
        router.query.page = 1;

        router.push({
            pathname: '/[categorySlug]' + "/filter",
            query: { ...router.query, priceMin: min, priceMax: max },
        }, undefined, { shallow: false, locale: router.locale });
    }

    function clearAll() {
        console.log(router.query)
        let payload = {
            categorySlug: router.query.categorySlug,
        }
        router.push({
            pathname: '/[categorySlug]',
            query: { ...payload },
        }, undefined, { shallow: false, locale: router.locale });
    }

    return (
        <Fragment>

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
                    onClick={() => setIsOpen(!isOpen)}
                >
                    Show Filters
                </button>
            </div>

            {/* { isOpen && ( */}
            <div>
                <Fragment>
                    {(Object.keys(router.query).length > 0 && (router.query.ShoeSize || router.query.Color || router.query.Size)) && (
                        <div className="pb-8">
                            <div className="filter-container">
                                {Object.keys(router.query).map((key, i) => {
                                    if (( key !== "categorySlug" && key !== "page" && key !== "pageNo") && router.query[key] !== "") {
                                        return (
                                            <Fragment key={`active-filter-${i}`}>
                                                {router.query[key].split("-").map((acf, y) => (
                                                    <span key={`single-a-filter-${y}`} onClick={() => changePage(key, acf)} className="act-filter">
                                                        {acf}
                                                    </span>
                                                ))}
                                            </Fragment >
                                        )
                                    }
                                })}
                            </div>
                            <button onClick={clearAll}>Clear all</button>
                        </div>
                    )}

                    <ShopWidget title={"Categories"}>
                        <ul className="tt-list-row">
                            {(productCategories && productCategories.length > 0) && productCategories.map((cat, i) => (

                                <li key={`filter-cat-${i}`} className={categorySlug === cat.slug ? 'active' : ''}>
                                    <Link href={`/${cat.slug}/`} >
                                        <a>
                                            {cat.name}
                                        </a>
                                    </Link>
                                </li>

                            ))}
                        </ul>
                    </ShopWidget>

                    {Object.keys(filters).map((key, i) => {

                        if (filters[key].label === "ShoeSize" || filters[key].label === "Size") {
                            return (
                                <div className={"pt-8"}>
                                    <ShopWidget title={filters[key].label} key={`shop-filters-key-${i}`}>
                                        <ul className="tt-options-swatch options-middle on-filter">
                                            {filters[key].values.map((filter, idx) => (
                                                <li key={filter.id + idx} className={router.query[filters[key].label]?.includes(filter.value) ? 'active' : ''}>
                                                    <a
                                                        onClick={() => changePage(filters[key].label, filter.value)}
                                                        data-filtertype="size"
                                                        data-filtervalue={filter.label}
                                                    >
                                                        {filter.label}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </ShopWidget>
                                </div>
                            )
                        } else if (filters[key].label === "Color") {
                            return (
                                <div className={"pt-8"}>
                                    <ShopWidget title={filters[key].label} key={`shop-filters-key-${i}`}>
                                        <ul className="tt-list-row tt-options-swatch options-middle on-filter">
                                            {filters[key].values.map((filter, idx) => (
                                                <li key={filter.id + idx} className={router.query[filters[key].label]?.includes(filter.value) ? 'active' : ''}>
                                                    <a
                                                        onClick={() => changePage(filters[key].label, filter.value)}
                                                        className="options-color tt-border"
                                                        style={{ backgroundColor: filter.value }}
                                                        data-filtertype="color"
                                                        data-filtervalue={filter.value}
                                                    >
                                                        {filter.label}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </ShopWidget>
                                </div>
                            )
                        } else {
                            return (
                                <div className={"pt-8"}>
                                    <ShopWidget title={filters[key].label} key={`shop-filters-key-${i}`}>
                                        <ul className="tt-list-row">
                                            {filters[key].values.map((filter, idx) => (
                                                <li key={filter.id + idx} className={router.query[filters[key].label]?.includes(filter.value) ? 'active' : ''}>
                                                    <a onClick={() => changePage(filters[key].label, filter.value)}
                                                    >
                                                        {filter.label}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </ShopWidget>
                                </div>
                            )
                        }
                    })}

                    <div className={"pt-8"}>
                        <ShopWidget title={"Prices"}>
                            <div style={{ maxWidth: "210px" }}>
                                <InputRange
                                    maxValue={(priceLimits.maxPrice) ? parseInt(priceLimits.maxPrice) : 100}
                                    minValue={(priceLimits.minPrice) ? parseInt(priceLimits.minPrice) : 0}
                                    value={priceVal}
                                    onChange={value => setPriceVal(value)}
                                    minLabel=""
                                    maxLabel=""
                                />

                                <div>
                                    <button className="bttn-default mt-8 ml-auto mr-auto" onClick={() => changePrice(priceVal.min, priceVal.max)} >Apply</button>
                                </div>
                            </div>
                        </ShopWidget>
                    </div>

                </Fragment>
            </div>

        </Fragment>
    );
};

export default ShopFilters;