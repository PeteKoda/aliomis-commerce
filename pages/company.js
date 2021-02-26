import Layout from "../src/components/Layout";
import client from '../src/components/ApolloClient';
import PRODUCTS_AND_CATEGORIES_QUERY from "../src/queries/product-and-categories";
import ABOUT_PAGE_QUERY from "../src/queries/about-page";
import Breadcrumb from "@components/breadcrumb";

import Intro from "../src/components/global/Intro"

import Main from "../src/components/about/Main"
import About from "../src/components/about/About"





export default function Contact(props) {

    console.log(props)

    const { page, productCategories } = props;

    return (
        <Layout productCategories={productCategories} >
            <Breadcrumb />

            <Intro data={props.page.aboutPageAcf.introGroup} />

            <div class="animated-wave" aria-hidden="true">
                <div class="animated-wave__wrapper">
                    <div class="animated-wave__wave"></div>
                </div>
            </div>

            <section style={{ position: "relative", top: "-32px", backgroundColor: "#faf8eb" }}>
                <Main data={props.page.aboutPageAcf.introGroup} />
            </section>

            <section>
                <About data={props.page.aboutPageAcf.about} />
            </section>

        </Layout>
    )
};

export async function getStaticProps() {

    const { data } = await client.query({
        query: PRODUCTS_AND_CATEGORIES_QUERY,
    });

    const pageData = await client.query({
        query: ABOUT_PAGE_QUERY,
        variables: { id: "cG9zdDoyODg=" }
    });

    return {
        props: {
            productCategories: data?.productCategories?.nodes ? data.productCategories.nodes : [],
            page: pageData?.data?.page ? pageData.data.page : null,
        },
        revalidate: 1
    }

};
