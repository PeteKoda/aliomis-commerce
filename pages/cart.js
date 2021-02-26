import Layout from "../src/components/Layout";
import client from '../src/components/ApolloClient';
import PRODUCTS_AND_CATEGORIES_QUERY from "../src/queries/product-and-categories";
import CartItemsContainer from "../src/components/cart/cart-page/CartItemsContainer2";
import Breadcrumb from "@components/breadcrumb";

export default function Cart(props) {

    console.log(props)

    const { page, productCategories } = props;

    return (
        <Layout productCategories={productCategories} >
            <Breadcrumb />
            <CartItemsContainer />
        </Layout>
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
        revalidate: 30
    }

};

