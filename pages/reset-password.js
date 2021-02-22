import Layout from "../src/components/Layout";
import client from '../src/components/ApolloClient';
import PRODUCTS_AND_CATEGORIES_QUERY from "../src/queries/product-and-categories";

import ResetPassword from "../src/components/profile/ResetPassword"

export default function ResetPasswordPage(props) {

    const {productCategories} = props;

    return (
        <Layout productCategories={productCategories} >
           <ResetPassword />
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
        revalidate: 1
    }

};
