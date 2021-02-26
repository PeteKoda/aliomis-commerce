import Layout from "../src/components/Layout";
import client from '../src/components/ApolloClient';
import PRODUCTS_AND_CATEGORIES_QUERY from "../src/queries/product-and-categories";
import CONTACT_PAGE_QUERY from "../src/queries/contact-page";
import Breadcrumb from "@components/breadcrumb";

import Intro from "../src/components/global/Intro"

import Main from "../src/components/contact/Main"




export default function Contact (props) {

    console.log(props)

	const { page, productCategories, bestSellers, offers, featured } = props;

	return (
			<Layout productCategories={ productCategories } >
                <Breadcrumb />
                <Intro data={props.page.contactPageAcf} />
                <Main data={props.page.contactPageAcf} />
			</Layout>
	)
};

export async function getStaticProps () {

	const { data } = await client.query( {
		query: PRODUCTS_AND_CATEGORIES_QUERY,
	} );

    const pageData = await client.query( {
		query: CONTACT_PAGE_QUERY,
        variables: { id: "cG9zdDoyNjg=" }
	} );

    console.log(data)
	return {
		props: {
			productCategories: data?.productCategories?.nodes ? data.productCategories.nodes : [],
			page: pageData?.data?.page ? pageData.data.page : null,
		},
		revalidate: 1
	}

};
