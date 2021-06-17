import React, { useState, useContext, useEffect } from 'react';
import Billing from "./Billing";
import ShippingMethod from "./ShippingMethod";
import YourOrder from "./YourOrder";
import PaymentModes from "./PaymentModes";
import { AppContext, UserContext } from "../context/AppContext";
import validateAndSanitizeCheckoutForm from '../../validator/checkout';
import cogoToast from "cogo-toast";
import validateAndSanitizeBillingForm from '../../validator/billingForm';
import { useMutation, useQuery } from '@apollo/client';
import { getFormattedCart, createCheckoutData, createCustomerUpdateData, createCustomerUpdateDataBillingAsShipping, createCustomerUpdateDataBilling } from "../../functions";
import OrderSuccess from "./OrderSuccess";
import GET_CART from "../../queries/get-cart";
import GET_USER from "../../queries/get-user";
import CHECKOUT_MUTATION from "../../mutations/checkout";
import UPDATE_CUSTOMER_MUTATION from "../../mutations/update-customer"
import UPDATE_SHIPPING_METHOD_MUTATION from "../../mutations/update-shipping-method"

import BigLoader from "@components/loader/BigLoader"

import StripeForm from "./StripeForm"
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(
    'pk_test_qA2xXYF2gwUbzyp45Z1OgWsZ00Gus2M7Vp' // <- Get this from your Stripe account
)

const CheckoutForm = () => {

    const initialState = {
        firstName: '',
        lastName: '',
        company: '',
        country: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        postcode: '',
        phone: '',
        email: '',
        createAccount: false,
        orderNotes: '',
        paymentMethod: '',
        shippingMethod: 'local_pickup:1',
        errors: null
    };

    // Use this for testing purposes, so you dont have to fill the checkout form over an over again.
    // const initialState = {
    //     firstName: 'Imran',
    //     lastName: 'Sayed',
    //     address1: '19 Place Broglie',
    //     address2: '',
    //     city: 'Strasbourg',
    //     state: 'Strasbourg',
    //     country: 'FR',
    //     postcode: '67000',
    //     phone: '6978515583',
    //     email: 'petekontaxistest@gmail.com',
    //     company: 'ABT',
    //     createAccount: false,
    //     orderNotes: '',
    //     paymentMethod: '',
    //     shippingMethod: 'local_pickup:1',
    //     errors: null
    // };

    const [cart, setCart] = useContext(AppContext);
    const [loggedUser, setLoggedUser] = useContext(UserContext);

    const [input, setInput] = useState(initialState);
    const [shippingInput, setShippingInput] = useState(initialState);

    const [orderData, setOrderData] = useState(null);
    const [customerData, setCustomerData] = useState(null);

    const [requestError, setRequestError] = useState(null);
    const [paymentType, setPaymentType] = useState(0);

    const [billingAsShipping, setBillingAsShipping] = useState(false);


    const [billingStatus, setBillingStatus] = useState(false);

    const [formStep, setFormStep] = useState(1);

    const [loadingPayment, setLoadingPayment] = useState(false)



    // Get Cart Data.
    const { loading: cartLoading, error, data, refetch } = useQuery(GET_CART, {
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

    // Get Logged User.

    const { loading: userLoading, error: userError, data: userResponse, refetch2 } = useQuery(GET_USER, {
        variables: {
            input: (loggedUser && loggedUser.customer) ? loggedUser.customer.id : ''
        },
        notifyOnNetworkStatusChange: true,
        onCompleted: () => {
            console.log(userResponse)
            if (userResponse && userResponse.customer) {
                console.log(userResponse.customer.billing)
                setInput({ ...userResponse.customer.billing })
                setShippingInput({ ...userResponse.customer.shipping, shippingMethod: 'local_pickup:1', email: userResponse.customer.email, phone: userResponse.customer.billing.phone })
            }

        },
        onError: (error) => {
            if (error && error.graphQLErrors) {

                // setRequestError( error.graphQLErrors[ 0 ].message );
            }
        }
    });

    // const [ getUser , { data: userResponse, loading: userLoading, error: userError }] = useQuery(GET_USER, {
    //     onCompleted: (data) => {
    //         console.log(":::::::::::::::::::::::")
    //         console.log(data)
    //     },
    //     onError: (error) => {
    //         if (error && error.graphQLErrors) {
    //             console.log(error)
    //             // setRequestError( error.graphQLErrors[ 0 ].message );
    //         }
    //     }
    // });

    // Checkout or CreateOrder Mutation.
    const [checkout, { data: checkoutResponse, loading: checkoutLoading, error: checkoutError }] = useMutation(CHECKOUT_MUTATION, {
        variables: {
            input: orderData
        },
        onCompleted: () => {
            // console.warn( 'completed CHECKOUT_MUTATION' );
            refetch();
        },
        onError: (error) => {
            if (error && error.graphQLErrors) {
                console.log(error)
                setLoadingPayment(false)
                // setRequestError( error.graphQLErrors[ 0 ].message );
            }
        }
    });

    // Checkout or CreateOrder Mutation.
    const [customerDataUpdate, { data: checkoutResponse2, loading: checkoutLoading2, error: checkoutError2 }] = useMutation(UPDATE_CUSTOMER_MUTATION, {
        variables: {
            input: customerData
        },
        onCompleted: () => {
            // console.warn( 'completed CHECKOUT_MUTATION' );

            refetch();
        },
        onError: (error) => {
            if (error && error.graphQLErrors) {
                console.log(error)
                // setRequestError( error.graphQLErrors[ 0 ].message );
            }
        }
    });

    // Checkout or CreateOrder Mutation.
    const [shippingMethodUpdate, { data: shippingMethodResponse, loading: shippingMethodLoading, error: shippingMethodError }] = useMutation(UPDATE_SHIPPING_METHOD_MUTATION, {
        variables: {
            input: { shippingMethods: [shippingInput.shippingMethod] }
        },
        onCompleted: () => {
            // console.warn( 'completed CHECKOUT_MUTATION' );
            refetch();
        },
        onError: (error) => {
            if (error && error.graphQLErrors) {
                console.log(error)
                // setRequestError( error.graphQLErrors[ 0 ].message );
            }
        }
    });




    /*
     * Handle form submit.
     *
     * @param {Object} event Event Object.
     *
     * @return {void}
     */
    const handleFormSubmit = (event) => {
        event.preventDefault();
        const checkOutData = createCheckoutData(input, shippingInput, !billingAsShipping);
        console.log(checkOutData)
        setOrderData(checkOutData);
        setRequestError(null);
    };

    /*
     * Handle onchange input.
     *
     * @param {Object} event Event Object.
     *
     * @return {void}
     */
    const handleOnChange = (event) => {

        console.log(event.target.value)

        if ('createAccount' === event.target.name) {
            const newState = { ...input, [event.target.name]: !input.createAccount };
            setInput(newState);
        } else {
            const newState = { ...input, [event.target.name]: event.target.value };
            setInput(newState);
        }

        if (event.target.value === "stripe") {
            setPaymentType(2)
        }

        if (event.target.value === "paypal") {
            setPaymentType(1)
        }

    };

    const handleOnChangeShipping = (event) => {

        console.log(event.target.value)

        if ('createAccount' === event.target.name) {
            const newState = { ...shippingInput, [event.target.name]: !shippingInput.createAccount };
            setShippingInput(newState);
        } else {
            const newState = { ...shippingInput, [event.target.name]: event.target.value };
            setShippingInput(newState);
        }

        if (event.target.value === "stripe") {
            setPaymentType(2)
        }

        if (event.target.value === "paypal") {
            setPaymentType(1)
        }

    };

    useEffect(() => {
        if (null !== loggedUser) {
        }

    }, [loggedUser]);


    useEffect(() => {
        if (null !== orderData) {
            // Call the checkout mutation when the value for orderData changes/updates.
            checkout();
            setLoadingPayment(true)
        }
    }, [orderData]);

    useEffect(() => {

        if (null !== customerData) {
            // Call the checkout mutation when the value for orderData changes/updates.
            customerDataUpdate();
        }

    }, [customerData]);

    useEffect(() => {
        if (shippingInput.shippingMethod) {
            shippingMethodUpdate()
        }
    }, [shippingInput.shippingMethod]);

    useEffect(() => {
        if (input.country) {
            updateCustomer("change-country")
        }
    }, [shippingInput.country])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [formStep])

    function updateCustomer(type) {
        const customerUpdatedData = billingAsShipping ? createCustomerUpdateDataBillingAsShipping(shippingInput) : createCustomerUpdateData(shippingInput);
        console.log(customerUpdatedData)
        setCustomerData(customerUpdatedData);

        if (type === "shipping-completed") {
            if (billingAsShipping) {
                setFormStep(3);
            } else {
                setFormStep(2)
            }
        }
        // setFormStep(2);
        // setRequestError(null);
    }

    function updateCustomerBilling(type) {
        const customerUpdatedData = createCustomerUpdateDataBilling(input);
        setCustomerData(customerUpdatedData);

        console.log(customerUpdatedData)

        setFormStep(3);
    }

    function shippingComplete(e) {
        e.preventDefault();
        console.log(shippingInput)
        const result = validateAndSanitizeBillingForm(shippingInput);
        console.log(result)
        if (!result.isValid) {
            setShippingInput({ ...shippingInput, errors: result.errors });

            cogoToast.error(result.errors[Object.keys(result.errors)[Object.keys(result.errors).length -1]], {
                position: 'bottom-right',
                hideAfter: 3
            })

            window.scrollTo(0, 0)
            return;
        }
        updateCustomer("shipping-completed")
    }

    function billingComplete(e) {
        e.preventDefault();
        console.log(input)
        input.shippingMethod = shippingInput.shippingMethod
        // setInput({...input , shippingMethod: shippingInput.shippingMethod})
        const result = validateAndSanitizeBillingForm(input);
        console.log(result)
        if (!result.isValid) {
            setInput({ ...input, errors: result.errors });
            return;
        }
        updateCustomerBilling()
    }

    return (
        <>
            { cart ? (
                <div>
                    <form onSubmit={handleFormSubmit} className="woo-next-checkout-form">
                        <div className="flex flex-wrap">

                            <div className="billing-details w-2/3 pr-8">

                                {/*Shipping Details*/}
                                <div className={`mb-4 ${formStep === 1 && "pb-4"}`} style={{ borderBottom: "1px solid lightgray" }}>
                                    <div className="flex mt-8">
                                        <div className="step-indicator step-indicator-active">1</div>
                                        <h2 className="text-xl font-medium mb-4">Informations de livraison</h2>
                                    </div>
                                    {formStep === 1
                                        ?
                                        <React.Fragment>
                                            <Billing input={shippingInput} handleOnChange={handleOnChangeShipping} />
                                            <ShippingMethod key="shipping-key" input={shippingInput} handleOnChange={handleOnChangeShipping} cart={cart} setShippingInput={setShippingInput} loading={shippingMethodLoading} />

                                            {(shippingInput && !shippingInput.shippingMethod.includes("mondial")) && (
                                                <label className="mt-8">
                                                    <input
                                                        type="checkbox"
                                                        checked={billingAsShipping}
                                                        onChange={() => setBillingAsShipping(!billingAsShipping)}
                                                        className="mr-4"
                                                    />
                                                    Garder les mêmes informations pour la facturation
                                                </label>
                                            )}

                                            {(shippingInput && shippingInput.shippingMethod.includes("mondial") && shippingInput.address2.includes("Mondial"))
                                                ?
                                                <button className="checkout-bttn mx-auto block my-4" onClick={(e) => shippingComplete(e)}>Continuer</button>
                                                :(
                                                    shippingInput && shippingInput.shippingMethod.includes("mondial")
                                                    ?
                                                        <div className="w-full text-center text-2xl">Pick a mondial relay store to continue</div>
                                                    :
                                                    ""
                                                )  
                                            }

                                            {(shippingInput && !shippingInput.shippingMethod.includes("mondial")) && (
                                                <button className="checkout-bttn mx-auto block my-4" onClick={(e) => shippingComplete(e)}>Continuer</button>
                                            )}


                                        </React.Fragment>
                                        :
                                        <div>

                                        </div>
                                    }
                                </div>



                                {/*Billing Details*/}
                                <div className={`mb-4 ${formStep === 2 && "pb-4"}`} style={{ borderBottom: "1px solid lightgray" }}>
                                    <div className="flex">
                                        <div className="step-indicator step-indicator-active">2</div>
                                        <h2 className="text-xl font-medium mb-4">Informations facture</h2>
                                    </div>
                                    {formStep === 2
                                        ?
                                        <React.Fragment>
                                            <Billing input={input} handleOnChange={handleOnChange} />
                                            <button className="checkout-bttn mx-auto block my-4" onClick={(e) => billingComplete(e)}>Continuer</button>

                                        </React.Fragment>
                                        :
                                        <div>

                                        </div>
                                    }
                                </div>

                                {/*Payment*/}
                                <div className="flex">
                                    <div className="step-indicator step-indicator-active">3</div>
                                    <h2 className="text-xl font-medium mb-4">Méthodes de paiement</h2>
                                </div>
                                {formStep === 3
                                    ?
                                    <div className={`mb-4 ${formStep === 3 && "pb-4"}`}>
                                        {/*Payment*/}
                                        <PaymentModes input={input} handleOnChange={handleOnChange} />

                                        {paymentType === 1 && (
                                            <div className="woo-next-place-order-btn-wrap mt-5">
                                                <button className="bg-purple-600 text-white px-5 py-3 rounded-sm w-auto xl:w-full" type="submit">
                                                    Place Order
                                                </button>
                                            </div>
                                        )}

                                        {/*Stripe*/}
                                        {paymentType === 2 && (
                                            <Elements stripe={stripePromise}>
                                                <StripeForm input={input} shippingInput={shippingInput} shipToDifferentAddress={!billingAsShipping} total={cart.totalProductsPrice} />
                                            </Elements>
                                        )}

                                        {/* Checkout Loading*/}
                                        {checkoutLoading && <p>Processing Order...</p>}
                                        {requestError && <p>Error : {requestError} :( Please try again</p>}

                                        {/* <button onClick={(e) => billingComplete(e)}>Continuer</button> */}
                                    </div>
                                    :
                                    <div>

                                    </div>
                                }


                            </div>
                            {/*	Order*/}
                            <div className="your-orders w-1/3 p-4" style={{ backgroundImage: "linear-gradient(to right,#e1e1e1 .2%,#f4f4f4 .2%)" }}>
                                <div style={{ position: "sticky", top: "30px" }}>
                                    <div className="flex items-center  mb-4">
                                        <div className="pr-2">
                                            {/* <img src="/shopping-cart.svg" style={{ width: "40px" }} /> */}
                                            <i className="icon-g-48" style={{ fontSize: "20px", color: "#4a4a4a" }} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-medium">Votre Commande</h2>
                                        </div>
                                    </div>
                                    <YourOrder cart={cart} cartLoading={cartLoading} shippingMethodLoading={shippingMethodLoading} />
                                </div>
                            </div>
                        </div>
                    </form>

                </div>
            ) : ''}

            <BigLoader isOpen={loadingPayment} text="Initializing Payment" />
            {/*	Show message if Order Sucess*/}
            <OrderSuccess response={checkoutResponse} setLoadingPayment ={setLoadingPayment} />
        </>
    );
};


export default CheckoutForm;
