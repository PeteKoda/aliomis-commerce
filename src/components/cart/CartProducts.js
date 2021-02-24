import Link from "next/link";
import { Fragment } from "react";
import CartItem from "./CartItem";

const CartProducts = (props) => {
    return (
        <div className="tt-shopcart-table">
            <table>
                <tbody>
                    {(props.cart && props.cart.products && props.cart.products.length > 0) && props.cart.products.map(product => (
                        <CartItem
                            key={product.databaseId}
                            cart={props.cart}
                            product={product}
                            handleClearCart={props.handleClearCart}
                            updateCartProcessing={props.updateCartProcessing}
                            handleRemoveProductClick={props.handleRemoveProductClick}
                            updateCart={props.updateCart}
                            loading={props.loading}
                        />
                    ))}
                </tbody>
            </table>
            <div className="tt-shopcart-btn">
                <div className="col-left">
                    <Link href="/"><a className="btn-link"><i className="icon-e-19" />CONTINUE SHOPPING</a></Link>
                </div>
                <div className="col-right">
                    <a className="btn-link cursor-pointer"
                        onClick={(event => {
                            props.handleClearCart(event)
                        })}
                    >
                        {props.clearCartProcessing
                            ?
                            <div className="loadingio-spinner-eclipse-acxari33u6t">
                                <div className="ldio-hzdb83wvgw">
                                    <div></div>
                                </div>
                            </div>
                            :
                            <Fragment>
                                <i className="icon-h-02" />CLEAR SHOPPING CART
                            </Fragment>
                        }
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CartProducts;