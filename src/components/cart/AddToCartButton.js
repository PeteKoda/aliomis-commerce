import { useState, useContext } from "react";
import { useQuery, useMutation } from '@apollo/client';
import { AppContext } from "../context/AppContext";
import cogoToast from "cogo-toast";


import { getFormattedCart } from "../../functions";
import Link from "next/link";
import { v4 } from 'uuid';
import GET_CART from "../../queries/get-cart";
import ADD_TO_CART from "../../mutations/add-to-cart";

const AddToCart = (props) => {

    const { product } = props;

    const productQryInput = {
        clientMutationId: v4(), // Generate a unique id.
        productId: product.databaseId,
        quantity: props.quantity ? props.quantity : 1
    };


    const [cart, setCart] = useContext(AppContext);

    const [showViewCart, setShowViewCart] = useState(false);
    const [requestError, setRequestError] = useState(null);

    /**
     * @TODO will update this in future, when required.
     * Handles adding items to the cart.
     *
     * @return {void}
     */
    // const handleAddToCartLocalStorage = () => {
    //
    // 	// If component is rendered client side.
    // 	if ( process.browser ) {
    //
    // 		let existingCart = localStorage.getItem( 'woo-next-cart' );
    //
    // 		// If cart has item(s) already, update existing or add new item.
    // 		if ( existingCart ) {
    //
    // 			existingCart = JSON.parse( existingCart );
    //
    // 			const qtyToBeAdded = 1;
    //
    // 			const updatedCart = updateCart( existingCart, product, qtyToBeAdded );
    //
    // 			setCart( updatedCart );
    //
    // 		} else {
    // 			/**
    // 			 * If No Items in the cart, create an empty array and add one.
    // 			 * @type {Array}
    // 			 */
    // 			const newCart = addFirstProduct( product );
    // 			setCart( newCart );
    // 		}
    //
    // 		// Show View Cart Button
    // 		setShowViewCart( true )
    // 	}
    // };

    // Get Cart Data.
    const { loading, error, data, refetch } = useQuery(GET_CART, {
        notifyOnNetworkStatusChange: true,
        onCompleted: () => {
            // console.warn( 'completed GET_CART' );

            // Update cart in the localStorage.
            const updatedCart = getFormattedCart(data);
            localStorage.setItem('woo-next-cart', JSON.stringify(updatedCart));

            // Update cart data in React Context.
            setCart(updatedCart);
        }
    });

    // Add to Cart Mutation.
    const [addToCart, { data: addToCartRes, loading: addToCartLoading, error: addToCartError }] = useMutation(ADD_TO_CART, {
        variables: {
            input: productQryInput
        },
        notifyOnNetworkStatusChange: true,
        onCompleted: () => {
            // console.warn( 'completed ADD_TO_CART' );

            // If error.
            if (addToCartError && addToCartError.graphQLErrors && addToCartError.graphQLErrors[0]) {
                setRequestError(addToCartError.graphQLErrors[0].message);
            }

            // On Success:
            // 1. Make the GET_CART query to update the cart with new values in React context.
            refetch();

            // 2. Show View Cart Button
            setShowViewCart(true)

            cogoToast.success('Product added to cart!', {
                position: 'bottom-right',
                hideAfter: 3
            })
        },
        onError: (error) => {
            if (error) {
                console.log(error)
                // setRequestError( error.graphQLErrors[ 0 ].message );
            }
        }
    });

    const handleAddToCartClick = (e) => {
        e.preventDefault()
        // handleAddToCartLocalStorage();
        setRequestError(null);
        addToCart();
    };

    return (
        <div>
            {/* Add To Cart Loading
            {addToCartLoading && <p>Adding to Cart...</p>} */}

            {/*	Check if its an external product then put its external buy link */}
            { "ExternalProduct" === product.__typename ? (
                <a href={product.externalUrl} target="_blank" className="px-3 py-1 rounded-sm mr-3 text-sm border-solid border border-current inline-block hover:bg-purple-600 hover:text-white hover:border-purple-600">Buy now</a>
            ) :
                (
                    addToCartLoading
                        ?
                        <button onClick={handleAddToCartClick} className={`bttn-default ${props.classes} mx-auto py-0`}>
                            <div className="loadingio-spinner-eclipse-acxari33u6t"><div className="ldio-hzdb83wvgw">
                                <div></div>
                            </div></div>
                        </button>
                        :
                        <button onClick={handleAddToCartClick} className={`bttn-default ${props.classes} mx-auto`}>Add to cart</button>
                )

            }
            {/* {
                showViewCart ? (
                    <Link href="/cart"><button className={`px-3 py-1 rounded-sm text-sm border-solid border border-current inline-block hover:bg-purple-600 hover:text-white hover:border-purple-600`}>View Cart</button></Link>
                ) : ''
            } */}
        </div >
    );
};

export default AddToCart;
