import Layout from "../src/components/Layout";
import client from '../src/components/ApolloClient';
import PRODUCTS_AND_CATEGORIES_QUERY from "../src/queries/product-and-categories";
import ProfilePage from "../src/components/profile/ProfilePage"
import Breadcrumb from "@components/breadcrumb";

export default function Profile (props) {

	const { products, productCategories, heroCarousel } = props;

	return (
			<Layout productCategories={ productCategories } >
                <Breadcrumb />
				<ProfilePage />
			</Layout>
	)
};

export async function getStaticProps () {

	const { data } = await client.query( {
		query: PRODUCTS_AND_CATEGORIES_QUERY,
	} );

	return {
		props: {
			productCategories: data?.productCategories?.nodes ? data.productCategories.nodes : [],
		},
		revalidate: 1
	}

};
