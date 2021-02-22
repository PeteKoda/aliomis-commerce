import { v4 } from 'uuid';

import { useMutation, useQuery } from '@apollo/client';
import React from 'react';
import { getFormattedCart} from "../../functions";

import GET_CART from "../../queries/get-cart";


const ThankYouC = () => {
    // Get Cart Data.
    const { loading: cartLoading, error, data, refetch } = useQuery(GET_CART, {
        notifyOnNetworkStatusChange: true,
        onCompleted: () => {
            // console.warn( 'completed GET_CART' );

            // Update cart in the localStorage.
            const updatedCart = getFormattedCart(data);
            localStorage.setItem('woo-next-cart', JSON.stringify(updatedCart));
        }
    });

    return (
        <div>
            <h1 className="mb-5 text-2xl uppercase text-center">Thank You For Your Order</h1>
            <h3 className="text-xl text-center">We've sent an email with your order details!!!</h3>
        </div>
    )
};

export default ThankYouC;
