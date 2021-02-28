import Link from 'next/link';
import CartIcon from "./cart/CartIcon";
import { useState, useContext, useEffect } from 'react';
import Modal from 'react-modal';
import LoginModal from './profile/LoginModal';
import { UserContext } from "./context/AppContext";
import client from "./ApolloClient";
import { useMutation } from '@apollo/client';
import { elastic as Menu } from 'react-burger-menu'

import Skeleton from 'react-loading-skeleton';
import REFRESH_TOKEN from '../mutations/refreshToken'
import { PRODUCT_BY_CATEGORY_SEARCH } from "../queries/product-by-filters";
import { v4 } from 'uuid';
import Product from "./Product";


import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import { useRouter } from "next/router";


import Image from 'next/image'



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
        background:"transparent!important"
    }
};

const burgerStyles = {
    bmBurgerButton: {
        display: "block",
        position: "absolute",
        width: "26px",
        height: "22px",
        left: "25px",
        top: "30px"
    },
    bmBurgerBars: {
        background: 'rgb(96 154 51)'
    },
    bmBurgerBarsHover: {
        background: '#a90000'
    },
    bmCrossButton: {
        height: '24px',
        width: '24px'
    },
    bmCross: {
        background: '#bdc3c7'
    },
    bmMenuWrap: {
        position: "fixed",
        height: "100%",
        top: "0!important",
        left: "0",
        backgroundImage: `url(/menu-tab-bg.jpg)`,
        top: "0px"
    },
    bmMenu: {
        // background: "rgb(96 154 51)",
        padding: "0.5em 1.5em 0",
        fontSize: "1.15em",
        minWidth: "300px",
        backgroundImage: `url(/menu-tab-bg.jpg)`,
        backgroundSize: "cover",
        overflow: "auto!important"
    },
    bmMorphShape: {
        fill: 'rgb(96 154 51)',
        width: "300px"
    },
    bmItemList: {
        color: "#b8b7ad",
    },
    bmItem: {
        display: "block!important",
        marginTop: "1rem",
        outline: "none",
        color: "#555",
        fontSize: "16px"
    },
    bmOverlay: {
        background: "rgba(0, 0, 0, 0.3)",
        top: "0!important",
        left: 0,
        top: 0
    }
}

Modal.setAppElement('#__next')


const Nav = (props) => {
    const router = useRouter()

    const [loggedUser, setLoggedUser] = useContext(UserContext);

    const [menuState, setMenuState] = useState(false);

    const [modalIsOpen, setIsOpen] = useState(false);

    const [searchIn, setSearchIn] = useState("")

    const [selectedNavCat, setSelectedNavCat] = useState(0)

    const [searchLoading, setSearchLoading] = useState(false)

    const [searchCategories, setSearchCategories] = useState([])

    const [noResults, setNoResults] = useState(false)

    const [shopExpand, setShopExpand] = useState(false)


    const { productCategories } = props;

    const [refreshToken, { data: rtResponse, loading: rtLoading, error: rtError }] = useMutation(REFRESH_TOKEN, {
        variables: {
            input: {
                clientMutationId: v4(),
                jwtRefreshToken: loggedUser ? loggedUser.authToken : '',
            }
        },
        onCompleted: (data) => {
            console.log("REFRESHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
            console.log(data.refreshJwtAuthToken.authToken)

            let localUser = (process.browser && typeof localStorage !== 'undefined') ? localStorage.getItem("woo-user") : null;
            localUser = JSON.parse(localUser).user

            let authData = {
                authToken: data.refreshJwtAuthToken.authToken,
                user: localUser,
            };

            localStorage.setItem('woo-user', JSON.stringify(authData));

            setLoggedUser(authData);

            refetch();
        },
        onError: (error) => {
            if (error && error.graphQLErrors) {
                console.log(error)
                // setRequestError( error.graphQLErrors[ 0 ].message );
            }
        }
    });

    let isMenuOpen = function (state) {
        setMenuState(state.isOpen)
    };

    useEffect(() => {
        if (!menuState) {
            if (document.getElementsByClassName('bm-menu-wrap')) {
                document.getElementsByClassName('bm-menu-wrap')[0].style.visibility = 'hidden';
            }
        } else {
            if (document.getElementsByClassName('bm-menu-wrap')) {
                document.getElementsByClassName('bm-menu-wrap')[0].style.visibility = 'visible';
            }
        }
    }, [menuState])


    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    function onChangeSearch(e) {
        if (e.key === "Enter") {
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

    useEffect(() => {
        if (router.query.categorySlug) {
            setSearchCategories([])
            setSearchIn("")
            setMenuState(false)
        }
    }, [router.query])

    useEffect(() => {
        if (process.browser) {
            let userData = localStorage.getItem('woo-user');
            userData = null !== userData ? JSON.parse(userData) : '';
            setLoggedUser(userData);
        }

        if( typeof window !== 'undefined' ){
            console.log(window.location.pathname.replace("/", "").replace("/", ""))
            console.log(productCategories.some(i => i.slug.includes(window.location.pathname.replace("/", "").replace("/", ""))))
        }

    }, [])

    useEffect(() => {
        setTimeout(() => {
            if (loggedUser && loggedUser.authToken) {
                refreshToken()
            }
        }, 500000)

        if (loggedUser) {
            closeModal()
        }
    }, [loggedUser])

    return (
        <nav className="bg-white px-4">
            <div className="container hidden lg:flex justify-between mx-auto pb-2 mb-2 l-gray" style={{ borderBottom: "1px solid #8b8b8b6b" }}>
                <div>
                    Free shipping for orders over $59!
                </div>
                <div >
                    <span>FAQ</span>
                    <span className="ml-4">Contact</span>
                </div>
            </div>
            <div className="container mx-auto">
                <div className="flex items-center justify-between flex-wrap mt-4 pb-4 lg:pb-0">

                    <div className="hidden lg:block w-1/3 relative">
                        <div className="mb-8 flex">
                            <img src="/search.svg" onClick={() => addBrandFilter(searchIn, "", "search", "")} className={"pb-1 pr-1"} style={{ borderBottom: "1px solid lightgrey" }} />
                            <input type="text" value={searchIn} onKeyPress={onChangeSearch} onChange={(e) => setSearchIn(e.target.value)} placeholder="Search" className="search-input" />
                        </div>
                        {
                            searchLoading
                                ?
                                <div style={{ position: "absolute", top: "38px", width: "200px", padding: "10px", boxShadow: "0 -1px 4px rgb(0 0 0 / 12%), 0 1px 0px rgb(0 0 0 / 24%)" }}>
                                    <Skeleton height={24} count={3} />
                                </div>
                                :
                                ((searchCategories && searchCategories.edges && searchCategories.edges.length > 0) && (
                                    <div style={{ position: "absolute", top: "38px", width: "200px", padding: "10px", boxShadow: "0 -1px 4px rgb(0 0 0 / 12%), 0 1px 0px rgb(0 0 0 / 24%)" }}>
                                        {console.log(searchCategories.edges)}
                                        <ul>
                                            {!noResults && searchCategories.edges.map((cat, i) => {
                                                if (cat.node.products.edges.length > 0) {
                                                    return (
                                                        <li key={`search-nav-${i}`} className={`py-2`} style={i !== 0 ? { borderTop: "1px solid lightgray", fontSize: "14px" } : { borderTop: "0", fontSize: "14px" }}>
                                                            <Link href={`/${cat.node.slug}/?search=${searchIn}`} >
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
                        <div>

                        </div>
                    </div>

                    <div className="flex items-center flex-shrink-0 text-black w-full lg:w-1/3 justify-center">
                        <span className="font-semibold text-xl tracking-tight">
                            <Link href="/">
                                <a className="">
                                    <div className="hidden lg:block">
                                        <Image
                                            src="https://aliomis.admin.w3vitals.com/wp-content/uploads/2021/01/logo.png"
                                            alt="Logo"
                                            width={100}
                                            height={122}
                                        />
                                    </div>
                                    <div className="block lg:hidden">
                                        <Image
                                            src="https://aliomis-eshop.s3.amazonaws.com/static/horizontalLogo.png"
                                            alt="Logo"
                                            width={160}
                                            height={49}
                                        />
                                    </div>

                                </a>
                            </Link>
                        </span>
                    </div>

                    {/*Menu button*/}

                    <div id="mainMenu" className="block md:hidden"></div>
                    <Menu styles={burgerStyles} isOpen={menuState} onStateChange={isMenuOpen} className="block lg:hidden" >
                        <Link href="/">
                            <a className="">
                                <div >
                                    <Image
                                        src="https://aliomis.admin.w3vitals.com/wp-content/uploads/2021/01/logo.png"
                                        alt="Logo"
                                        width={100}
                                        height={122}
                                    />
                                </div>
                            </a>
                        </Link>

                        <div>
                            <Link href={`/`}>
                                <a className={`block mobile-nav-link ${( typeof window !== 'undefined' && window.location.pathname === "/") && ("mobile-nav-link-active")} `}>
                                    Home
                                </a>
                            </Link>
                        </div>
                        <div>
                            <div 
                                className={`block mobile-nav-link ${(typeof window !== 'undefined' && window.location.pathname !== "/" && productCategories.some(i => i.slug.includes(window.location.pathname.replace("/", "").replace("/", "")))) && "mobile-nav-link-active" }`} 
                                onClick={() => setShopExpand(!shopExpand)}
                            >
                                Shop
                                <span className={"chevron-nav"}>➱</span>
                            </div>
                        </div>
                        {shopExpand && (
                            <div className="ml-4">
                                {/* <div className="block mobile-nav-link">
                                    Categories
                                </div> */}

                                {(productCategories && productCategories.length) ? (
                                    productCategories.map((productCategory, i) => (
                                        <div className="block mobile-nav-link" key={productCategory.id + i} >
                                            <Link href={`/${productCategory.slug}`} >
                                                <a className={`block mt-4 text-base`}>
                                                    {productCategory.name}
                                                </a>
                                            </Link>
                                        </div>
                                    ))
                                ) : ''}


                            </div>
                        )}
                        <div>
                            <Link href={`/company/`}>
                                <a className={`block mobile-nav-link ${( typeof window !== 'undefined' && window.location.pathname === "/company/") && ("mobile-nav-link-active")}`}>
                                    About Us
                                </a>
                            </Link>
                        </div>
                        <div className="pb-8">
                            <Link href={`/contact/`}>
                                <a className={`block mobile-nav-link ${( typeof window !== 'undefined' && window.location.pathname === "/contact/") && ("mobile-nav-link-active")}`}>
                                    Contact
                                </a>
                            </Link>
                        </div>

                        {/* {menu.map((tab, index) => {
                            return (
                                <div key={`mMenu-${index}`} className="menu-item text-left text-white" style={{ "marginTop": "1rem" }}>

                                    {tab.node.childItems.edges.length > 0
                                        ?
                                        <React.Fragment>
                                            <div onClick={() => subMenuClick(index)} className="flex justify-between items-center" >
                                                <span className="h-dropdown">
                                                    {tab.node.label}
                                                </span>
                                                <img className="mob-sort-down h-chev-down" src={sortDown} alt="sort-down" />
                                            </div>
                                            <div className="m-dropdown-content hidden">
                                                {tab.node.childItems.edges.length > 0 && (
                                                    createSubMobile(tab.node.childItems.edges, tab.node.label)
                                                )}
                                            </div>
                                        </React.Fragment>
                                        :
                                        <React.Fragment>
                                            {(tab.node.url.includes("home"))
                                                ?
                                                <Link to={`${tab.node.url.replace("http://home", "")}/`}>
                                                    {tab.node.label}
                                                </Link>
                                                :
                                                <Link to={`/${tab.node.url.replace("http://", "")}/`}>
                                                    {tab.node.label}
                                                </Link>
                                            }
                                            <div className="h-chev-down hidden"></div>
                                            <div className="m-dropdown-content hidden"></div>
                                        </React.Fragment>
                                    }
                                </div>
                            )
                        })} */}

                    </Menu>


                    {/*MMenu in mobile*/}
                    <div className={`absolute right-0 lg:relative overflow-hidden lg:h-full flex-grow lg:flex lg:items-center w-auto lg:w-1/3 justify-end`}>
                        <div className="text-sm font-medium flex align-center"> 
                            {loggedUser && loggedUser.customer && loggedUser.customer.username
                                ?
                                <Popup trigger={
                                    <div className="user-icon" style={{zIndex: "9",position:"relative"}}>
                                        <div>{loggedUser.customer.username[0]}</div>
                                    </div>
                                } position="bottom center" arrow={false} contentStyle={{ borderRadius: '0', marginTop: "0.5rem", maxWidth: "130px" }}>
                                    <div>
                                        <ul>
                                            <li>
                                                <Link href={`/profile/`} >
                                                    <a className="w-full text-center block hover:text-black hover:bg-gray-100 focus:outline-none">
                                                        Profile
                                                    </a>
                                                </Link>
                                            </li>
                                            <li className="w-full text-center block hover:text-black hover:bg-gray-100 focus:outline-none">
                                                Logout
                                            </li>
                                        </ul>
                                    </div>
                                </Popup>

                                :
                                <a onClick={openModal} className="block lg:inline-block lg:mt-0 text-black hover:text-black mr-auto ">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="block m-auto" fill="none" viewBox="0 0 24 24" width="18" height="auto" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                </a>
                            }
                            <CartIcon />
                        </div>
                    </div>

                </div>
                <div className="hidden lg:flex flex-wrap mt-4 relative">
                    <div className="text-sm font-medium uppercase lg:flex-grow flex justify-center">
                        <Link href={`/`}>
                            <a className={`block mt-4 lg:inline-block lg:mt-0 text-black hover:text-black mr-10 ${( typeof window !== 'undefined' && window.location.pathname === "/") && ("underline")}`}>
                                Home
                            </a>
                        </Link>

                        <div className="block mt-4 lg:inline-block lg:mt-0 text-black hover:text-black mr-10 menu-hv-link pb-4 cursor-pointer">
                            <div className={`${ (typeof window !== 'undefined' && window.location.pathname !== "/" && productCategories.some(i => i.slug.includes(window.location.pathname.replace("/", "").replace("/", "")))) && "underline" }`}>
                                Shop
                            </div>
                            <div className="container mmenu-container px-4 xl:px-8 pt-4">
                                <div className="flex">
                                    <div className="mt-4">
                                        <div className="pb-4">
                                            <h4 className="">Categories</h4>
                                        </div>
                                        {(productCategories && productCategories.length) ? (
                                            productCategories.map((productCategory, i) => (
                                                <div className="mt-2 category-nav-link" key={productCategory.id} onMouseEnter={() => setSelectedNavCat(i)}>
                                                    <Link href={`/${productCategory.slug}/`} >
                                                        <a className={`block mt-4 lg:inline-block lg:mt-0 mr-10 custom-underline ${selectedNavCat === i && ("custom-underline-active")}`}>
                                                            {productCategory.name}
                                                        </a>
                                                    </Link>
                                                </div>
                                            ))
                                        ) : ''}
                                    </div>
                                    <div className="mt-4">
                                        {console.log(productCategories[0].products.nodes)}
                                        <div className="product-categories grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8 relative px-8">
                                            {(undefined !== productCategories) && (
                                                productCategories[selectedNavCat].products.nodes.map(product => <Product key={product?.id} product={product} categorySlug={""} loading={false} />)
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <Link href={`/company/`}>
                            <a className={`block mt-4 lg:inline-block lg:mt-0 text-black hover:text-black mr-10 ${( typeof window !== 'undefined' && window.location.pathname === "/company/") && ("underline")}`}>
                                About Us
                            </a>
                        </Link>
                        <Link href={`/contact/`}>
                            <a className={`block mt-4 lg:inline-block lg:mt-0 text-black hover:text-black mr-10 ${( typeof window !== 'undefined' && window.location.pathname === "/contact/") && ("underline")}`}>
                                Contact
                            </a>
                        </Link>

                    </div>
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <LoginModal closeModal={closeModal} />
            </Modal>
        </nav >
    )
};

export default Nav;
