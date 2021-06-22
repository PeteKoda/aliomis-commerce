import Skeleton from 'react-loading-skeleton';
import Link from 'next/link';
import { useState, useContext, useEffect } from 'react';
import { useRouter } from "next/router";
import client from "@components/ApolloClient";
import { PRODUCT_BY_CATEGORY_SEARCH } from "@queries/product-by-filters";





const SearchBoxOne = ({ className, isHidden, openHandler, closeHandler }) => {
    const router = useRouter()
    const [searchIn, setSearchIn] = useState("")
    const [searchLoading, setSearchLoading] = useState(false)
    const [noResults, setNoResults] = useState(false)
    const [searchCategories, setSearchCategories] = useState([])




    useEffect(() => {
        if (router.query.categorySlug) {
            setSearchCategories([])
            setSearchIn("")
        }
    }, [router.query])

    function onChangeSearch(e) {
        if (e.key === "Enter") {
            e.preventDefault()
            searchProducts(e.target.value)
            setSearchLoading(true)
        }
    }

    async function searchProducts(search) {
        const { data } = await client.query(({
            query: PRODUCT_BY_CATEGORY_SEARCH,
            variables: { search: search }
        }));

        let hasResults = false;

        if (data.productCategories) {
            data.productCategories.edges.map((cat, i) => {
                if (cat.node.products.edges.length) {
                    hasResults = true
                }
            })

            if (hasResults) {
                setNoResults(false)
                setSearchCategories(data.productCategories)
            } else {
                setNoResults(true)
                setSearchCategories(data.productCategories)
            }
        }

        setSearchLoading(false)

        console.log(data)
    }

    return (
        <div className={`tt-parent-box ${className}`}>
            <div className={`tt-search tt-dropdown-obj ${!isHidden ? "active" : 'not-active'}`}>
                <button className="tt-dropdown-toggle" data-id="searchBox" onClick={openHandler}>
                    <i className="icon-f-85" />
                </button>

                <div className="tt-dropdown-menu">
                    <div className="container">
                        <form>
                            <div className="tt-col">
                                <input
                                    type="text"
                                    className="tt-search-input"
                                    placeholder="Search Products..."
                                    value={searchIn}
                                    onKeyPress={onChangeSearch}
                                    onChange={(e) => setSearchIn(e.target.value)}
                                />

                                <button
                                    className="tt-btn-search"
                                    style={{top: "27px"}}
                                    type="submit"
                                />
                            </div>
                            <div className="tt-col">
                                <button className="tt-btn-close icon-g-80" data-id="searchBox" onClick={closeHandler} />
                            </div>
                            <div className="tt-info-text">
                                What are you Looking for?
                            </div>
                        </form>
                        {
                            searchLoading
                                ?
                                <div style={{ width: "100%", padding: "10px", boxShadow: "0 -1px 4px rgb(0 0 0 / 12%), 0 1px 0px rgb(0 0 0 / 24%)" }}>
                                    <Skeleton height={24} count={3} />
                                </div>
                                :
                                ((searchCategories && searchCategories.edges && searchCategories.edges.length > 0) && (
                                    <div className="bg-white" style={{ width: "100%", padding: "10px", boxShadow: "0 -1px 4px rgb(0 0 0 / 12%), 0 1px 0px rgb(0 0 0 / 24%)" }}>
                                        {console.log(searchCategories.edges)}
                                        <ul className="mb-0">
                                            {!noResults && searchCategories.edges.map((cat, i) => {
                                                if (cat.node.products.edges.length > 0) {
                                                    return (
                                                        <li key={`search-nav-${i}`} className={`py-2`} style={i !== 0 ? { borderTop: "1px solid lightgray", fontSize: "14px" } : { borderTop: "0", fontSize: "14px" }}>
                                                            <Link href={`/${cat.node.slug}/filter/?page=1&search=${searchIn}`} >
                                                                <a>
                                                                    {`(${cat.node.products.edges.length}) results in: ${cat.node.name}`}
                                                                </a>
                                                            </Link>
                                                        </li>
                                                    )
                                                }
                                            })}

                                            {noResults && (
                                                <li style={{ fontSize: "14px" }}>
                                                    No Results Found
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchBoxOne;
