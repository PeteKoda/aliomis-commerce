import "../src/styles/style.scss";
import "../src/styles/main.scss";

import 'react-tippy/dist/tippy.css'
import "@assets/scss/style.scss";

import Router from 'next/router';
import Head from "next/head";
import { Fragment } from "react"

import CartContextProvider from "@global/CartContext";
// import CompareContextProvider from "@global/CompareContext";
import WishlistContextProvider from "@global/WishlistContext";

import NProgress from 'nprogress';

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps }) {
    return (
        <Fragment>
            <Head>
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,200;0,300;0,400;0,700;1,200;1,300;1,400;1,600&display=swap" rel="stylesheet" />

            </Head>
            
            <CartContextProvider>
                    <WishlistContextProvider>
                            <Component {...pageProps}/>
                    </WishlistContextProvider>
            </CartContextProvider>
        </Fragment>
    )
}

export default MyApp

