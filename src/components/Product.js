import Link from 'next/link';
import AddToCartButton from '../components/cart/AddToCartButton';
import clientConfig from '../../client-config';
import Image from 'next/image'
import { isEmpty } from 'lodash';
import Price from "./single-product/price";


const Product = (props) => {
    const { product } = props;

    return (
        // @TODO Need to handle Group products differently.
        undefined !== product && 'GroupProduct' !== product.__typename ? (
            <div className="product mb-3">
                <Link href={`/${product?.productCategories?.edges[0].node?.slug}/${product.slug}`} >
                    <a className="relative block mx-auto" style={{width: props.customWidth ? props.customWidth : "180px", height: props.customHeight ? props.customHeight : "280px"}}>
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
                { props.details && (
                    <div className={`product-info ${props.detailClasses}`}>
                        <h3 className="product-title mt-3 text-center">
                            {product.name ? product.name : ''}
                        </h3>
                        <Price salesPrice={product?.price} regularPrice={product?.regularPrice} />
                    </div>
                )}

                { props.bttn && (
                    <div>
                        <AddToCartButton product={product} classes={props.bttnClasses} />
                    </div>
                )}

            </div>
        ) : (
                ''
            )
    );
};

export default Product;
