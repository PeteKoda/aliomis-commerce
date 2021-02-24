import Head from "next/head";
import { AppProvider } from "./context/AppContext";
// import Header from "./Header";
// import Footer from "./Footer";
import { FooterOne as Footer } from "@components/footer";
import client from "./ApolloClient";
import Router from "next/router";
import NProgress from "nprogress";
import { ApolloProvider } from "@apollo/client";
import { HeaderSix as Header } from "./header";


Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const Layout = (props) => {

    return (
        <AppProvider>
            <ApolloProvider client={client}>
                <div>
                    <Head>
                        <title>Woocommerce React Theme</title>
                    </Head>
                    {/* {!props.noHeader && (
                        <Header productCategories={props.productCategories} />
                    )} */}

                    {!props.noHeader && (
                        <Header
                            containerFluid={false}
                            logoAlignment="center"
                            navbarAlignment="center"
                            productCategories={props.productCategories}
                        />
                    )}

                    {props.children}

                    {!props.noHeader && (
                        <Footer productCategories={props.productCategories} />
                    )}
                </div>
            </ApolloProvider>
        </AppProvider>
    );
};

export default Layout;
