import Link from 'next/link';
import AddToCartButton from '../components/cart/AddToCartButton';
import clientConfig from '../../client-config';
import Image from 'next/image'
import isEmpty from "lodash/isEmpty";
import Price from "./single-product/price";
import { useState, useEffect } from "react"


const ProductFromGrid = (props) => {
    const { product } = props;

    const [isFridgeProduct, setIsFridgeProduct] = useState(false)

    // useEffect(() => {
    //     if (props.product && props.product.node.shippingClasses && props.product.node.shippingClasses.edges[0]?.node?.name) {
    //         if (props.product.node.shippingClasses.edges[0].node.name === "produits-frais") {
    //             setIsFridgeProduct(true)
    //         }
    //     }
    // }, [])

    console.log(product.node)

    return (
        // @TODO Need to handle Group products differently.
        undefined !== product && 'GroupProduct' !== product?.node.__typename ? (
            <div className="product mb-3">
                <Link href={`/${product?.node?.productCategories?.edges[0].node?.slug === "boutique" ? product?.node?.productCategories?.edges[1].node?.slug : product?.node?.productCategories?.edges[0].node?.slug}/${product.node.slug}`} >
                    <a className="relative block mx-auto" style={{ width: props.customWidth ? props.customWidth : "220px", height: props.customHeight ? props.customHeight : "220px" }}>
                        {!isEmpty(product.node.image) ? (
                            <Image
                                src={product.node.image.sourceUrl}
                                alt="Product image"
                                layout="fill"

                            />
                        ) : !isEmpty(clientConfig.productImagePlaceholder) ? (
                            <img
                                src={clientConfig.productImagePlaceholder}
                                alt="Placeholder product image"
                            />
                        ) : null}

                        {product?.awards?.edges.length > 0 && (
                            <div className="flex flex-col relative justify-end items-end">
                                {product.node.awards.edges.map((award) => (
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
                    </a>
                </Link>
                {props.details && (
                    <div className={`product-info ${props.detailClasses}`}>
                        <h3 className="product-title mt-3 text-center">
                            {product.node.name ? product.node.name : ''}
                        </h3>
                        <Price salesPrice={product?.node?.price} regularPrice={product?.node?.regularPrice} />
                    </div>
                )}

                {props.bttn && (
                    <div>
                        {
                            !product?.node?.stockQuantity
                                ?
                                <div className="block text-center">
                                    Out Of Stock
                                </div>
                                :
                                <AddToCartButton product={product.node} classes={props.bttnClasses} isFridgeProduct={isFridgeProduct} />
                        }
                    </div>
                )}

            </div>
        ) : (
            ''
        )
    );
};

export default ProductFromGrid;
