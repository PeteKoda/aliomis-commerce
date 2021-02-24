import Head from "next/head";
import { Fragment, useContext, useState } from "react";
// import Breadcrumb from "@components/breadcrumb";
import { AppContext } from "../../context/AppContext";
import EmptyCart from "@components/cart/EmptyCart";
import { Container, Col, Row } from "react-bootstrap";
import { HeaderOne as Header } from "@components/header";
import { FooterOne as Footer } from "@components/footer";
import CartProducts from "@components/cart/CartProducts";
import CalculateShipping from "@components/cart/CalculateShipping";
import { getFormattedCart, getUpdatedItems } from '../../../functions';
import { ContentWrapperOne as ContentWrapper } from "@components/content-wrapper";
import { v4 } from 'uuid';
import { useMutation, useQuery } from '@apollo/client';
import UPDATE_CART from "../../../mutations/update-cart";
import GET_CART from "../../../queries/get-cart";
import CLEAR_CART_MUTATION from "../../../mutations/clear-cart";
import { isEmpty } from 'lodash'
import Skeleton from 'react-loading-skeleton';


const CartItemsContainer = () => {

    const [cart, setCart] = useContext(AppContext);
    const [requestError, setRequestError] = useState(null);

    const [clCart, setClCart] = useState(false)

    // Get Cart Data.
    const { loading, error, data, refetch } = useQuery(GET_CART, {
        notifyOnNetworkStatusChange: true,
        onCompleted: () => {

            // console.warn( 'completed GET_CART', data );

            // Update cart in the localStorage.
            const updatedCart = getFormattedCart(data);
            localStorage.setItem('woo-next-cart', JSON.stringify(updatedCart));
            // Update cart data in React Context.
            console.log("Update Cart")
            console.log(updatedCart)
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
            setClCart(true)
            localStorage.setItem('woo-next-cart', null);
            setCart(null);
        },
        onError: (error) => {
            if (error) {
                const errorMessage = !isEmpty(error?.graphQLErrors?.[0]) ? error.graphQLErrors[0]?.message : '';
                setRequestError(errorMessage);
            }
        }
    });

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
        <Fragment>
            <div className="shopping-cart-wrapper content-indent">
                {(cart && cart.products && !clCart) && cart.products.length > 0 && (
                    <Container>
                        <h1 className="tt-title-subpages noborder">SHOPPING CART</h1>

                        <Row>
                            <Col xl={8}>
                                <CartProducts
                                    handleClearCart={handleClearCart}
                                    cart={cart}
                                    key="cartkey"
                                    updateCartProcessing={updateCartProcessing}
                                    handleRemoveProductClick={handleRemoveProductClick}
                                    updateCart={updateCart}
                                    loading={updateCartProcessing || loading}
                                    clearCartProcessing= {clearCartProcessing}
                                />
                            </Col>

                            <Col xl={4} className="relative">
                                <CalculateShipping
                                    refetchCart={refetch}
                                    cart={cart}
                                    cartLoading={updateCartProcessing || loading}
                                />
                            </Col>
                        </Row>
                    </Container>
                )}
            </div>

            {(!cart || clCart) && (
                <div className="empty-cart-wrapper">
                    <EmptyCart />
                </div>
            )}
        </Fragment>
    );
};

export default CartItemsContainer;