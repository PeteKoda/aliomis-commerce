import Link from 'next/link';
import AddToCartButton from '../cart/AddToCartButton';
import clientConfig from '../../../client-config';
import Image from 'next/image'
import isEmpty from "lodash/isEmpty";

import { useState, Fragment } from "react";


const Product = (props) => {
    const { product, categorySlug } = props;

    console.log(product)

    const [priceHovered, setPriceHovered] = useState(false)

    return (
        // @TODO Need to handle Group products differently.
        undefined !== product && 'GroupProduct' !== product.__typename ? (
            <div className="product pb-12" style={{ backgroundColor: "#f6f8fa" }} onMouseEnter={() => setPriceHovered(true)} onMouseLeave={() => setPriceHovered(false)}>
                <Link href={`/${product?.productCategories?.edges[0].node?.slug}/${product.slug}`} >
                    <a className="relative flex justify-center">
                        {!isEmpty(product.image) ? (
                            <Image
                                src={product.image.sourceUrl}
                                alt="Product image"
                                width={396}
                                height={535}
                            />
                            // <img src={product.image.sourceUrl} alt="Product image" />
                        ) : !isEmpty(clientConfig.productImagePlaceholder) ? (
                            <img
                                src={clientConfig.productImagePlaceholder}
                                alt="Placeholder product image"
                            />
                        ) : null}

                        {/* <div className="product-image-inner">
                            <div className="qodef-woo-product-additional-icons">
                                <div className="yith-wcwl-add-to-wishlist add-to-wishlist-435  wishlist-fragment on-first-load">
                                    <div className="yith-wcwl-add-button">
                                        {"<3"}
                                    </div>
                                </div>
                                <a href="#" className="button yith-wcqv-button" >Quick View</a>
                            </div>
                            <a href="https://konsept.qodeinteractive.com/product/ficus/" className="woocommerce-LoopProduct-link woocommerce-loop-product__link"></a>
                            <AddToCartButton product={product} />
                        </div> */}
                    </a>
                </Link>
                <div className="flex justify-between px-8">
                    <div>
                        <h3 className="promo-pr-name">
                            {product.name ? product.name : ''}
                        </h3>
                        <h4 className="promo-pr-catname">
                            {product.productCategories?.edges ? product.productCategories.edges[0].node.name : ''}
                        </h4>
                    </div>
                    <div className="relative">
                        <div className={`flex flex-wrap justify-end ${!priceHovered ? "promo-ph" : "promo-pnh"}`}>
                            <p style={{ color: "red", textDecoration: "line-through" }}>{product?.regularPrice}</p>
                            <p className="text-base pl-2">{product?.price}</p>
                        </div>
                        <div className={`promo-adc ${priceHovered ? "promo-aph" : "promo-apnh"}`}>
                            <AddToCartButton product={product} classes={"px-1 "} />
                        </div>
                    </div>
                </div>
            </div>
        ) : (
                ''
            )
    );
};

export default Product;
