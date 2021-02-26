import Layout from "../src/components/Layout";
import client from '../src/components/ApolloClient';
import PRODUCTS_AND_CATEGORIES_QUERY from "../src/queries/product-and-categories";
import ThankYouC from "../src/components/checkout/ThankYou";
import Breadcrumb from "@components/breadcrumb";

export default function ThankYou(props) {

    const { products, productCategories, heroCarousel } = props;

    return (
        <Layout productCategories={productCategories} >
            <Breadcrumb />
            <div className="checkout container mx-auto my-20 px-4 xl:px-0" style={{ maxWidth: "1090px" }}>
                <ThankYouC />
            </div>
        </Layout >
    )
};

export async function getStaticProps() {

    const { data } = await client.query({
        query: PRODUCTS_AND_CATEGORIES_QUERY,
    });

    return {
        props: {
            productCategories: data?.productCategories?.nodes ? data.productCategories.nodes : [],
        },
        revalidate: 1
    }

};
