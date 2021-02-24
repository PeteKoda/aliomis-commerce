import Link from 'next/link';
import { useContext, useState } from 'react';
import { AppContext } from "../../context/AppContext";
import { getFormattedCart, getUpdatedItems } from '../../../functions';
import CartItem from "./CartItem";
import { v4 } from 'uuid';
import { useMutation, useQuery } from '@apollo/client';
import UPDATE_CART from "../../../mutations/update-cart";
import GET_CART from "../../../queries/get-cart";
import CLEAR_CART_MUTATION from "../../../mutations/clear-cart";
import { isEmpty } from 'lodash'
import Skeleton from 'react-loading-skeleton';



const CartItemsContainer = () => {


    // @TODO wil use it in future variations of the project.
    const [cart, setCart] = useContext(AppContext);
    const [requestError, setRequestError] = useState(null);

    // Get Cart Data.
    const { loading, error, data, refetch } = useQuery(GET_CART, {
        notifyOnNetworkStatusChange: true,
        onCompleted: () => {

            // console.warn( 'completed GET_CART', data );

            // Update cart in the localStorage.
            const updatedCart = getFormattedCart(data);
            localStorage.setItem('woo-next-cart', JSON.stringify(updatedCart));

            // Update cart data in React Context.
            setCart(updatedCart);
        }
    });

    // Update Cart Mutation.
    const [updateCart, { data: updateCartResponse, loading: updateCartProcessing, error: updateCartError }] = useMutation(UPDATE_CART, {
        notifyOnNetworkStatusChange: true,
        onCompleted: () => {
            refetch();
        },
        onError: (error) => {
            if (error) {
                const errorMessage = error?.graphQLErrors?.[0]?.message ? error.graphQLErrors[0].message : '';
                setRequestError(errorMessage);
            }
        }
    });

    // Update Cart Mutation.
    const [clearCart, { data: clearCartRes, loading: clearCartProcessing, error: clearCartError }] = useMutation(CLEAR_CART_MUTATION, {
        onCompleted: () => {
            refetch();
        },
        onError: (error) => {
            if (error) {
                const errorMessage = !isEmpty(error?.graphQLErrors?.[0]) ? error.graphQLErrors[0]?.message : '';
                setRequestError(errorMessage);
            }
        }
    });

    /*
     * Handle remove product click.
     *
     * @param {Object} event event
     * @param {Integer} Product Id.
     *
     * @return {void}
     */
    const handleRemoveProductClick = (event, cartKey, products) => {

        event.stopPropagation();
        if (products.length) {

            // By passing the newQty to 0 in updateCart Mutation, it will remove the item.
            const newQty = 0;
            const updatedItems = getUpdatedItems(products, newQty, cartKey);

            updateCart({
                variables: {
                    input: {
                        clientMutationId: v4(),
                        items: updatedItems
                    }
                },
            });
        }
    };

    // Clear the entire cart.
    const handleClearCart = (event) => {

        event.stopPropagation();

        if (clearCartProcessing) {
            return;
        }

        clearCart({
            variables: {
                input: {
                    clientMutationId: v4(),
                    all: true
                }
            },
        });
    }

    return (
        <div className="py-8 md:py-20" style={{ backgroundColor: "#f9f9f9" }}>
            <div className="cart product-cart-container container mx-auto px-4 xl:px-0">
                {cart ? (
                    <div className="woo-next-cart-wrapper container">
                        <div className="cart-header grid grid-cols-2 gap-4">
                            <h1 className="text-2xl mb-5 uppercase">Cart</h1>
                            {/*Clear entire cart*/}
                            <div className="clear-cart text-right">
                                <button className="px-4 py-1 bg-gray-500 text-white rounded-sm w-auto" onClick={(event) => handleClearCart(event)} disabled={clearCartProcessing}>
                                    <span className="woo-next-cart">Clear Cart</span>
                                    <i className="fa fa-arrow-alt-right" />
                                </button>
                                {clearCartProcessing ? <p>Clearing...</p> : ''}
                                {updateCartProcessing ? <p>Updating...</p> : null}
                            </div>
                        </div>
                        <div className="flex flex-wrap mb-5">
                            <div className="w-full pr-0" >
                                {cart.products.length && (
                                    cart.products.map((item, itemNumber) => (
                                        <CartItem
                                            key={item.databaseId}
                                            item={item}
                                            updateCartProcessing={updateCartProcessing}
                                            products={cart.products}
                                            handleRemoveProductClick={handleRemoveProductClick}
                                            updateCart={updateCart}
                                            itemNumber={itemNumber}
                                            loading={updateCartProcessing || loading}
                                        />
                                    ))
                                )}
                            </div>

                            {/*Cart Total*/}
                            <div className="row woo-next-cart-total-container border p-3 bg-white flex justify-center">
                                <div className="">
                                    <table className="table table-hover mb-1">
                                        <tbody>
                                            <tr className="table-light flex flex-col">
                                                <td className="woo-next-cart-element-total text-2xl font-normal">Subtotal</td>
                                                {
                                                    (updateCartProcessing || loading)
                                                        ?
                                                        <div><Skeleton height={30} width={100} /></div>
                                                        :
                                                        <td className="woo-next-cart-element-amt text-2xl font-bold">{('string' !== typeof cart.totalProductsPrice) ? cart.totalProductsPrice.toFixed(2) : cart.totalProductsPrice}</td>
                                                }
                                            </tr>
                                            {/* <tr className="table-light">
										<td className="woo-next-cart-element-total">Total</td>
										<td className="woo-next-cart-element-amt">{ ( 'string' !== typeof cart.totalProductsPrice ) ? cart.totalProductsPrice.toFixed(2) : cart.totalProductsPrice }</td>
									</tr> */}
                                        </tbody>
                                    </table>
                                    {
                                        (updateCartProcessing || loading)
                                            ?
                                            <div><Skeleton height={54} width={158} /></div>
                                            :
                                            <Link href="/checkout">
                                                <button className="text-white px-3 py-3 rounded-sm w-auto xl:w-full" style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}>
                                                    <span className="woo-next-cart-checkout-txt">Proceed to Checkout</span>
                                                </button>
                                            </Link>
                                    }

                                </div>
                            </div>
                        </div>

                        {/* Display Errors if any */}
                        { requestError ? <div className="row woo-next-cart-total-container mt-5"> {requestError} </div> : ''}
                    </div>
                ) : (
                        <div className="container mx-auto my-32 px-4 xl:px-0">
                            <h2 className="text-2xl mb-5">No items in the cart</h2>
                            <Link href="/">
                                <button className="bg-purple-600 text-white px-5 py-3 rounded-sm">
                                    <span className="woo-next-cart-checkout-txt">Add New Products</span>
                                    <i className="fas fa-long-arrow-alt-right" />
                                </button>
                            </Link>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default CartItemsContainer;
