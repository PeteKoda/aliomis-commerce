import Layout from "../src/components/Layout";
import Product from "../src/components/Product";
import client from '../src/components/ApolloClient';
import ParentCategoriesBlock from "../src/components/category/category-block/ParentCategoriesBlock";
import PRODUCTS_AND_CATEGORIES_QUERY from "../src/queries/product-and-categories";
import HOME_PAGE_QUERY from "../src/queries/home-page";
import Services from "@components/services";
import LatestBlog from "@components/blog";


import PromoCarousel from "../src/components/home/PromoCarousel";
import IntroBanner from "../src/components/home/IntroBanner";
import AboutUs from "../src/components/home/AboutUs";
import Featured from "../src/components/home/Featured";
import Clients from "../src/components/home/Clients";
// import Articles from "../src/components/home/Articles";

export default function Home (props) {

    console.log(props)

	const { page, productCategories, bestSellers, offers, featured } = props;

	return (
			<Layout productCategories={ productCategories } >
                {/*Intro Section*/}
                <section>
                    <IntroBanner data={page.homePageAcf.intro} />
                </section>

				{/*Offer - Best sellers Carousel*/}
                <section>
                    <PromoCarousel bestSellers={bestSellers} offers={offers} promo={page.homePageAcf.promo} />
                </section>

                <section>
                    <AboutUs data={page.homePageAcf.aboutUs} />
                </section>

                <section>
                    <Featured data={page.homePageAcf.featured} featured={featured} />
                </section>
                <section>
                    <div className="text-center py-8" style={{backgroundColor:"#bdced3",color: "#ffffff",fontSize: "37px",fontWeight:"200",fontStyle: "italic"}}>
                        Free Shipping On $75+
                    </div>
                </section>
                <section>
                    <Clients data={page.homePageAcf.featured} clients={page.homePageAcf.clients} />
                </section>
                {/* <section>
                    <Articles />
                </section> */}

                <section className="mb-24">
                    <LatestBlog/>
                </section>

                <section>
                    <Services />
                </section>


				{/*Categories*/ }
				{/* <div className="product-categories-container container mx-auto my-32 px-4 xl:px-0">
					<h2 className="main-title text-xl mb-5 uppercase"><span className="main-title-inner">Categories</span></h2>
					<ParentCategoriesBlock productCategories={ productCategories }/>
				</div> */}
				{/*Products*/ }
				{/* <div className="products container mx-auto my-32 px-4 xl:px-0">
					<h2 className="products-main-title main-title mb-5 text-xl uppercase"><span className="main-title-inner">Products</span></h2>
					<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
						{ products.length ? (
							products.map( product => <Product key={ product.id } product={ product }/> )
						) : '' }
					</div>
				</div> */}

			</Layout>
	)
};

export async function getStaticProps () {

	const { data } = await client.query( {
		query: PRODUCTS_AND_CATEGORIES_QUERY,
	} );

    const pageData = await client.query( {
		query: HOME_PAGE_QUERY,
        variables: { id: "cG9zdDoyMTQ=" }
	} );

    console.log(data)
	return {
		props: {
			productCategories: data?.productCategories?.nodes ? data.productCategories.nodes : [],
			page: pageData?.data?.page ? pageData.data.page : null,
            bestSellers: pageData?.data?.bestSellers ? pageData.data.bestSellers : null,
            offers: pageData?.data?.offers ? pageData.data.offers : null,
            featured: pageData?.data?.featured ? pageData.data.featured : null,

		},
		revalidate: 1
	}

};
