import Link from 'next/link';
import AddToCartButton from '../components/cart/AddToCartButton';
import clientConfig from '../../client-config';
import Image from 'next/image'
import isEmpty from "lodash/isEmpty";
import Price from "./single-product/price";
import { useState, useEffect } from "react"


const Product = (props) => {
    const { product } = props;

    const [isFridgeProduct, setIsFridgeProduct] = useState(false)

    useEffect(() => {
        if (props.product && props.product.shippingClasses && props.product.shippingClasses.edges[0]?.node?.name) {
            if (props.product.shippingClasses.edges[0].node.name === "produits-frais") {
                setIsFridgeProduct(true)
            }
        }
    }, [])

    // console.log(product)

    return (
        // @TODO Need to handle Group products differently.
        undefined !== product && 'GroupProduct' !== product.__typename ? (
            <div className="product mb-3">
                <Link href={`/${product?.productCategories?.edges[0].node?.slug === "boutique" ? product?.productCategories?.edges[1].node?.slug : product?.productCategories?.edges[0].node?.slug}/${product.slug}`} >
                    <a className="relative block mx-auto" style={{ width: props.customWidth ? props.customWidth : "220px", height: props.customHeight ? props.customHeight : "220px" }}>
                        {!isEmpty(product.image) ? (
                            <Image
                                src={product.image.sourceUrl}
                                alt="Product image"
                                layout="fill"
                                className={"object-cover"}
                            // width={props.customWidth ? props.customWidth : 480}
                            // height={props.customHeight ? props.customHeight : 480}
                            />
                            // <img src={product.image.sourceUrl} alt="Product image" />
                        ) : !isEmpty(clientConfig.productImagePlaceholder) ? (
                            <img
                                src={clientConfig.productImagePlaceholder}
                                alt="Placeholder product image"
                            />
                        ) : null}

                        {product?.awards?.edges.length > 0 && (
                            <div className="flex flex-col relative justify-end items-end">
                                {product.awards.edges.map((award) => (
                                    <div>
                                        <Image
                                            src={award.node.awardAcf.image.sourceUrl}
                                            alt={award.node.awardAcf.image.altText}
                                            title={award.node.description}
                                            layout="fixed"
                                            width={40}
                                            height={40}
                                            quality={50}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {isFridgeProduct && (
                            <div className="flex flex-col relative justify-end items-end">
                                <img src="/assets/images/general/fridge-products.png" style={{width:"50px"}} />
                            </div>
                        )}

                        {/* {!props.addToCartStatic && (
                            <div className="product-image-inner">
                                <AddToCartButton product={product} />
                            </div>
                        )} */}

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
                {props.details && (
                    <div className={`product-info ${props.detailClasses}`}>
                        <h3 className="product-title mt-3 text-center">
                            {product.name ? product.name : ''}
                        </h3>
                        <Price salesPrice={product?.price} regularPrice={product?.regularPrice} />
                    </div>
                )}

                {props.bttn && (
                    <div>
                        {
                            !product?.stockQuantity
                                ?
                                <div className="block text-center">
                                    Out Of Stock
                                </div>
                                :
                                <AddToCartButton product={product} classes={props.bttnClasses} isFridgeProduct={isFridgeProduct} />
                        }
                    </div>
                )}

            </div>
        ) : (
            ''
        )
    );
};

export default Product;
