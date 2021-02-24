import Link from "next/link";
import { Fragment, useContext, useState } from "react";
import propType from "prop-types";
import Quantity from "./Quantity";
import { CURRENCY } from "@utils/constant";
import { CartContext } from "@global/CartContext";
import { toCapitalize } from "@utils/toCapitalize";
import Skeleton from 'react-loading-skeleton';
import ProductView from "../Product"


const CartItem = ({ product, className, cart, updateCart, updateCartProcessing, loading, handleRemoveProductClick }, props) => {
    const { image, name, price, qty, totalPrice } = product;
    const slug = `/shop/${name.toLowerCase().split(' ').join('-')}`;
    const { removeProduct } = useContext(CartContext);
    const [csOpen, setCsOpen] = useState(false);


    console.log(cart)

    return (
        <Fragment>
            <tr className={className}>
                <td>
                    <span
                        className="tt-btn-close"
                        style={{ cursor: 'pointer' }}
                        onClick={(event) => handleRemoveProductClick(event, product.cartKey, cart.products)}
                    />
                </td>
                <td>
                    <div className="tt-product-img">
                        <Link href={slug}>
                            <a>
                                <img
                                    src={image.sourceUrl}
                                    alt={image.title}
                                />
                            </a>
                        </Link>
                    </div>
                </td>
                <td>
                    <h2 className="tt-title">
                        <Link href={slug}>{name}</Link>
                    </h2>
                    <ul className="tt-list-parameters">
                        <li>
                            <div className="tt-price">
                                {CURRENCY + price}
                            </div>
                        </li>
                        <li>
                            <div className="detach-quantity-mobile">
                                <Quantity
                                    product={product}
                                    products={cart?.products ? cart.products : []}
                                    // handleClearCart={props.handleClearCart}
                                    updateCartProcessing={updateCartProcessing}
                                    handleRemoveProductClick={props.handleRemoveProductClick}
                                    updateCart={updateCart}
                                    loading={loading}
                                />
                            </div>
                        </li>
                        <li>
                            {updateCartProcessing
                                ?
                                <div className="tt-price subtotal">
                                    <Skeleton height={22} width={50} />
                                </div>
                                :
                                <div className="tt-price subtotal">
                                    {totalPrice}
                                </div>
                            }

                        </li>
                    </ul>
                </td>
                <td>
                    <div className="tt-price">
                        {CURRENCY + price}
                    </div>
                </td>
                <td>
                    <div className="detach-quantity-desktop">
                        <Quantity
                            product={product}
                            products={cart?.products ? cart.products : []}
                            // handleClearCart={props.handleClearCart}
                            updateCartProcessing={updateCartProcessing}
                            handleRemoveProductClick={props.handleRemoveProductClick}
                            updateCart={updateCart}
                            loading={loading}

                        />
                    </div>
                </td>
                <td>

                    {loading
                        ?
                        <div className="tt-price subtotal">
                            <Skeleton height={28} width={50} />
                        </div>
                        :
                        <div className="tt-price subtotal">
                            {totalPrice}
                        </div>
                    }

                </td>
            </tr>

            <tr>
                <td colspan="6">
                    {(product.crossSell && product.crossSell.edges.length > 0) && (
                        <div style={{ marginTop: "1rem" }}>
                            <h4 class={`tt-collapse-title-custom block md:hidden ${csOpen && "tt-collapse-title-custom-open"}`} onClick={() => setCsOpen(!csOpen)}>Products Best Bought Together</h4>
                            {/* <button className={`m-auto block bttn-btg block md:hidden ${csOpen && ("bttn-btg-active")}`} onClick={() => setCsOpen(!csOpen)}><h3 style={{ color: "white", fontSize: "21px" }}>Products Best Bought Together</h3></button> */}
                            { csOpen && (
                                <div className="flex mt-4 mx-auto justify-center flex-wrap" style={{ maxWidth: "556px" }}>
                                    {product.crossSell.edges.map((cs, i) => (
                                        <div key={`cross-sell-${i}`} className="w-full sm:w-1/2 flex justify-center">
                                            <ProductView product={cs?.node} customWidth={100} customHeight={120} details={true} bttn={true} bttnClasses={"bttn-small-atc"} categorySlug={cs?.node?.productCategories?.edges[0].node.slug} loading={false} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {(product.crossSell && product.crossSell.edges.length > 0) && (
                        <div className="p-4 mt-4 hidden md:block" style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px" }}>
                            <h3 className="text-center font-bold text-xl text-black">Products Usually Bought Together</h3>
                            <div className="flex mt-4 mx-auto justify-center flex-wrap" style={{ maxWidth: "556px" }}>
                                {product.crossSell.edges.map((cs, i) => (
                                    <div key={`cross-sell-${i}`} className="w-full md:w-1/3 flex justify-center">
                                        <ProductView product={cs?.node} customWidth={100} customHeight={120} details={true} bttn={true} bttnClasses={"bttn-small-atc"} detailClasses={"text-sm"} categorySlug={cs?.node?.productCategories?.edges[0].node.slug} loading={false} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </td>
            </tr>
        </Fragment>
    );
};

CartItem.propTypes = {
    product: propType.object.isRequired
}

export default CartItem;