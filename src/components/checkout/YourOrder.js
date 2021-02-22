import React from 'react';
import CheckoutCartItem from "./CheckoutCartItem";
import Skeleton from 'react-loading-skeleton';


const YourOrder = ({ cart, cartLoading, shippingMethodLoading }) => {
    console.log(cart)
    return (
        <React.Fragment>
            { cart ? (
                <div>
                    {/*Product Listing*/}
                    <table className="checkout-cart table table-hover w-full mb-10">
                        <thead>
                            <tr className="woo-next-cart-head-container text-left">
                                <th className="woo-next-cart-heading-el" scope="col" />
                                <th className="woo-next-cart-heading-el" scope="col">Product</th>
                                <th className="woo-next-cart-heading-el" scope="col">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.products.length && (
                                cart.products.map(item => (
                                    <CheckoutCartItem key={item.databaseId} item={item} />
                                ))
                            )}
                            {/*Total*/}
                            {
                                cartLoading || shippingMethodLoading
                                    ?
                                    <React.Fragment>
                                        <tr style={{ borderBottom: "0" }}>
                                            <td className="woo-next-checkout-total font-normal text-md">Shipping Price:</td>
                                            <td className="" />
                                            <td className="woo-next-checkout-total font-bold text-md"><Skeleton height={20} width={50} /></td>
                                        </tr>
                                        <tr>
                                            <td className="woo-next-checkout-total font-normal text-md">Subtotal:</td>
                                            <td className="" />
                                            <td className="woo-next-checkout-total font-bold text-md"><Skeleton height={20} width={50} /></td>
                                        </tr>
                                        <tr className="bg-gray-200">
                                            <td className="woo-next-checkout-total font-normal text-xl" style={{ paddingLeft: "0.5rem", color: "black", fontWeight: "600" }}>Total Price</td>
                                            <td className="" />
                                            <td className="woo-next-checkout-total font-bold text-xl mr-2" style={{ paddingRight: "0.5rem", color: "black", fontWeight: "600" }}><Skeleton height={20} width={50} /></td>
                                        </tr>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        <tr style={{ borderBottom: "0" }}>
                                            <td className="woo-next-checkout-total font-normal text-md">Shipping Price:</td>
                                            <td className="" />
                                            <td className="woo-next-checkout-total font-bold text-md">{cart.shippingTotal ? cart.shippingTotal : "?"}</td>
                                        </tr>
                                        <tr>
                                            <td className="woo-next-checkout-total font-normal text-md">Subtotal:</td>
                                            <td className="" />
                                            <td className="woo-next-checkout-total font-bold text-md">{cart.subtotal}</td>
                                        </tr>
                                        <tr className="bg-gray-200">
                                            <td className="woo-next-checkout-total font-normal text-xl" style={{ paddingLeft: "0.5rem", color: "black", fontWeight: "600" }}>Total Price</td>
                                            <td className="" />
                                            <td className="woo-next-checkout-total font-bold text-xl mr-2" style={{ paddingRight: "0.5rem", color: "black", fontWeight: "600" }}>{cart.totalProductsPrice}</td>
                                        </tr>
                                    </React.Fragment>
                            }

                            {/* <tr className="">
							<td className=""/>
							<td className="woo-next-checkout-total">Total</td>
							<td className="woo-next-checkout-total">{ cart.totalProductsPrice }</td>
						</tr> */}
                        </tbody>
                    </table>
                </div>
            ) : ''}
        </React.Fragment>
    )
};

export default YourOrder;
