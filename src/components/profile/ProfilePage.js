import { v4 } from 'uuid';

import { useMutation, useQuery } from '@apollo/client';
import { AppContext, UserContext } from "../../components/context/AppContext";
import React, { useState, useContext, useEffect } from 'react';
import Billing from "./../checkout/Billing";
import Shipping from "./../checkout/Shipping";
import UserForm from "./UserForm"
import validateAndSanitizeAccountForm from '../../validator/accountForm';
import validateAndSanitizeGeneralUserForm from '../../validator/userGeneralForm';
import validateAndSanitizeAccountFormShipping from '../../validator/accountFormShipping';
import cogoToast from "cogo-toast";

import GET_USER from "../../queries/get-user";
import GET_ORDERS from "../../queries/get-orders";
import UPDATE_CUSTOMER_MUTATION from "../../mutations/update-customer"
import RESET_PASSWORD_MUTATION from "../../mutations/reset-password"

import { createCustomerUpdateData, createCustomerUpdateDataBilling, createCustomerUpdateDataGeneral } from "../../functions";



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

const initialUserState = {
    firstName: '',
    lastName: '',
    email: '',
};


const ProfilePage = () => {

    const [input, setInput] = useState(initialState);
    const [shippingInput, setShippingInput] = useState(initialState);
    const [name, setName] = useState({ firstName: "", lastName: "" })
    const [cart, setCart] = useContext(AppContext);
    const [loggedUser, setLoggedUser] = useContext(UserContext);
    const [activeTab, setActiveTab] = useState(1)
    const [customerData, setCustomerData] = useState(null);
    const [userInput, setUserInput] = useState(initialUserState);
    const [orders, setOrders] = useState();


    // Get Logged User.
    const { loading: userLoading, error: userError, data: userResponse, refetch2 } = useQuery(GET_USER, {
        variables: {
            input: (loggedUser && loggedUser.customer) ? loggedUser.customer.id : ''
        },
        notifyOnNetworkStatusChange: true,
        onCompleted: () => {
            if (userResponse && userResponse.customer) {
                setInput({ ...userResponse.customer.billing })
                setShippingInput({ ...userResponse.customer.shipping, shippingMethod: 'local_pickup:1' })
                setName({ firstName: userResponse.customer.firstName, lastName: userResponse.customer.lastName })
                setUserInput({
                    firstName: userResponse.customer.firstName,
                    lastName: userResponse.customer.lastName,
                    email: userResponse.customer.email,
                })
            }

        },
        onError: (error) => {
            if (error && error.graphQLErrors) {
            }
        }
    });

    // Get Customer Orders.
    const { loading: ordersLoading, error: ordersError, data: ordersResponse, refetch3 } = useQuery(GET_ORDERS, {
        variables: {
            input: (loggedUser && loggedUser.customer) ? loggedUser.customer.databaseId : ''
        },
        onCompleted: () => {
            if (ordersResponse && ordersResponse.orders.edges) {
                setOrders(ordersResponse.orders.edges)
            }

        },
        onError: (error) => {
            if (error && error.graphQLErrors) {
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

    // Reset Password By Email
    const [resetPassword, { data: resetData, loading: resetLoading, error: resetError }] = useMutation(RESET_PASSWORD_MUTATION, {
        variables: {
            input: {
                clientMutationId: v4(),
                username: (userInput) ? userInput.email : ''
            }
        },
        onCompleted: (data) => {
            console.log(data)

            cogoToast.success(`Visit ${userInput.email} to reset your account.`, {
                position: 'top-center',
                hideAfter: 10
            })
        },
        onError: (error) => {
            if (error && error.graphQLErrors) {
                console.log(error)
                // setRequestError( error.graphQLErrors[ 0 ].message );
            }
        }
    });



    useEffect(() => {
        console.log(input)
    }, [input])

    useEffect(() => {
        if (null !== customerData) {
            // Call the checkout mutation when the value for orderData changes/updates.
            customerDataUpdate();
        }
    }, [customerData]);

    const handleOnChangeUser = (event) => {
        console.log(event.target.value)
        const newState = { ...userInput, [event.target.name]: event.target.value };
        setUserInput(newState);

    };

    const handleOnChange = (event) => {

        console.log(event.target.value)

        const newState = { ...input, [event.target.name]: event.target.value };
        setInput(newState);

    };

    const handleOnChangeShipping = (event) => {

        console.log(event.target.value)

        const newState = { ...shippingInput, [event.target.name]: event.target.value };
        setShippingInput(newState);

    };

    function updateGeneralUser() {
        const customerUpdatedData = createCustomerUpdateDataGeneral(userInput);
        setCustomerData({ ...customerUpdatedData, id: loggedUser ? loggedUser.customer.id : '' });
    }

    function updateCustomerBilling() {
        const customerUpdatedData = createCustomerUpdateDataBilling(input);
        setCustomerData({ ...customerUpdatedData, id: loggedUser ? loggedUser.customer.id : '' });
    }

    function updateCustomer(type) {
        const customerUpdatedData = createCustomerUpdateData(shippingInput);
        setCustomerData({ ...customerUpdatedData, id: loggedUser ? loggedUser.customer.id : '' });
    }

    function shippingComplete() {
        const result = validateAndSanitizeAccountFormShipping(shippingInput);
        console.log(result)
        if (!result.isValid) {
            setShippingInput({ ...shippingInput, errors: result.errors });
            return;
        }
        updateCustomer()
    }

    function userComplete() {
        const result = validateAndSanitizeGeneralUserForm(userInput);
        console.log(result)
        if (!result.isValid) {
            setUserInput({ ...userInput, errors: result.errors });
            return;
        }
        updateGeneralUser()
    }

    function billingComplete() {
        console.log(input)
        const result = validateAndSanitizeAccountForm(input);
        console.log(result)
        if (!result.isValid) {
            setInput({ ...input, errors: result.errors });
            return;
        }
        updateCustomerBilling()
    }




    return (
        <div className="checkout container mx-auto my-8 md:my-20 px-4 xl:px-0" style={{ maxWidth: "1090px" }}>
            {console.log(loggedUser)}
            <div className="">
                <div className="">
                    <nav className="flex flex-col w-full mb-8 overflow-auto">
                        {/* <div className="flex flex-wrap mt-8">
                            <div className="w-1/2">
                                <img
                                    src="https://randomuser.me/api/portraits/women/27.jpg"
                                    className="mx-auto w-20 h-20 rounded-full"
                                />
                            </div>
                            <div className="w-1/2">
                                <span className="font-semibold text-white">Ava Harper</span>
                                <button className="bg-green-500 text-white px-4 py-2 rounded-md border border-blue-500 hover:bg-white hover:text-green-500">
                                    Premium
                                </button>
                            </div>
                        </div> */}
                        <div className="">
                            <ul className="flex justify-around profile-nav-tabs">
                                <li onClick={() => setActiveTab(1)} className={` px-4 py-4 flex flex-row  border-gray-300 hover:text-black  hover:font-bold ${activeTab === 1 ? "text-black font-bold" : "text-gray-700"}`}>
                                    <span>
                                        <svg
                                            className="fill-current h-5 w-5 "
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M7 3C8.86384 3 10.4299 4.27477 10.874 6H19V8H10.874C10.4299 9.72523 8.86384 11 7 11C4.79086 11 3 9.20914 3 7C3 4.79086 4.79086 3 7 3ZM7 9C8.10457 9 9 8.10457 9 7C9 5.89543 8.10457 5 7 5C5.89543 5 5 5.89543 5 7C5 8.10457 5.89543 9 7 9Z"
                                                fill="currentColor"
                                            />
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M17 20C15.1362 20 13.5701 18.7252 13.126 17H5V15H13.126C13.5701 13.2748 15.1362 12 17 12C19.2091 12 21 13.7909 21 16C21 18.2091 19.2091 20 17 20ZM17 18C18.1046 18 19 17.1046 19 16C19 14.8954 18.1046 14 17 14C15.8954 14 15 14.8954 15 16C15 17.1046 15.8954 18 17 18Z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                    </span>
                                    <a href="#">
                                        <span className="ml-2">Customer Details</span>
                                    </a>
                                </li>
                                <li onClick={() => setActiveTab(2)} className={` px-4 py-4 flex flex-row  border-gray-300 hover:text-black  hover:font-bold ${activeTab === 2 ? "text-black font-bold" : "text-gray-700"}`}>
                                    <span>
                                        <svg
                                            className="fill-current h-5 w-5 "
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7ZM14 7C14 8.10457 13.1046 9 12 9C10.8954 9 10 8.10457 10 7C10 5.89543 10.8954 5 12 5C13.1046 5 14 5.89543 14 7Z"
                                                fill="currentColor"
                                            />
                                            <path
                                                d="M16 15C16 14.4477 15.5523 14 15 14H9C8.44772 14 8 14.4477 8 15V21H6V15C6 13.3431 7.34315 12 9 12H15C16.6569 12 18 13.3431 18 15V21H16V15Z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                    </span>
                                    <a href="#">
                                        <span className="ml-2">Billing Details</span>
                                    </a>
                                </li>
                                <li onClick={() => setActiveTab(3)} className={` px-4 py-4 flex flex-row  border-gray-300 hover:text-black  hover:font-bold ${activeTab === 3 ? "text-black font-bold" : "text-gray-700"}`}>
                                    <span>
                                        <svg
                                            className="fill-current h-5 w-5 "
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7ZM14 7C14 8.10457 13.1046 9 12 9C10.8954 9 10 8.10457 10 7C10 5.89543 10.8954 5 12 5C13.1046 5 14 5.89543 14 7Z"
                                                fill="currentColor"
                                            />
                                            <path
                                                d="M16 15C16 14.4477 15.5523 14 15 14H9C8.44772 14 8 14.4477 8 15V21H6V15C6 13.3431 7.34315 12 9 12H15C16.6569 12 18 13.3431 18 15V21H16V15Z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                    </span>
                                    <a href="#">
                                        <span className="ml-2">Shipping Details</span>
                                    </a>
                                </li>
                                <li onClick={() => setActiveTab(4)} className={` px-4 py-4 flex flex-row  border-gray-300 hover:text-black  hover:font-bold ${activeTab === 4 ? "text-black font-bold" : "text-gray-700"}`}>
                                    <span>
                                        <svg className="fill-current h-5 w-5 " viewBox="0 0 24 24">
                                            <path
                                                d="M16 20h4v-4h-4m0-2h4v-4h-4m-6-2h4V4h-4m6
                        4h4V4h-4m-6 10h4v-4h-4m-6 4h4v-4H4m0 10h4v-4H4m6
                        4h4v-4h-4M4 8h4V4H4v4z"
                                            ></path>
                                        </svg>
                                    </span>
                                    <a href="#">
                                        <span className="ml-2">Orders History</span>
                                    </a>
                                </li>

                            </ul>
                        </div>
                    </nav>
                </div>
                <div className=" w-full md:w-auto mx-auto mb-16 lg:mb-8" style={{ maxWidth: "750px" }}>
                    {activeTab === 1 && (
                        <div className="px-4 lg:px-8">
                            <div>
                                <h2 className="font-bold text-2xl">General</h2>
                                <UserForm input={userInput} handleOnChange={handleOnChangeUser} />
                                <div className="">
                                    <div className="form-group mb-3 flex items-center justify-between">
                                        <span className="text-xl">
                                            Password:
                                        </span>
                                        <button className="bttn-default px-4" onClick={() => resetPassword()}>
                                            {resetLoading
                                                ?
                                                <div className="loadingio-spinner-eclipse-acxari33u6t">
                                                    <div className="ldio-hzdb83wvgw">
                                                        <div>
                                                        </div>
                                                    </div>
                                                </div>
                                                :
                                                <span>
                                                    Reset by email
                                                </span>
                                            }
                                        </button>
                                    </div>
                                </div>
                                <button className="checkout-bttn mx-auto block my-4" onClick={(e) => userComplete(e)}>Save</button>
                            </div>
                        </div>
                    )}
                    {activeTab === 2 && (
                        <div className="px-4 lg:px-8">
                            <div>
                                <h2 className="font-bold text-2xl">Billing Details</h2>
                                <Billing input={input} handleOnChange={handleOnChange} />
                                <button className="checkout-bttn mx-auto block my-4" onClick={(e) => billingComplete(e)}>Save</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 3 && (
                        <div className="px-4 lg:px-8">
                            <div className="pt-8">
                                <h2 className="font-bold text-2xl">Shipping Details</h2>
                                <Shipping input={shippingInput} handleOnChange={handleOnChangeShipping} />
                                <button className="checkout-bttn mx-auto block my-4" onClick={(e) => shippingComplete(e)}>Save</button>

                            </div>
                        </div>
                    )}

                    {activeTab === 4 && (
                        <div className="px-0 lg:px-8">
                            { orders && orders.length && (
                                <table className=" m-5 mx-auto text-gray-100 block md:table" style={{ overflowX: "auto", backgroundImage: "linear-gradient(to right, rgb(127 138 93), rgb(143 154 109))" }}>
                                    <tr className="text-left border-b-2 border-white-300">
                                        <th className="px-4 py-3">Code</th>
                                        <th className="px-4 py-3">Address</th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Total</th>
                                        <th className="px-4 py-3">Status</th>
                                    </tr>
                                    { orders.map((order, i) => (
                                        <tr className="border-b border-white-400" key={`orders-${i}`}>
                                            <td className="px-4 py-3">#{order.node.databaseId}</td>
                                            <td className="px-4 py-3">{order.node.shipping.address1}</td>
                                            <td className="px-4 py-3">{order.node.datePaid}</td>
                                            <td className="px-4 py-3">{order.node.total}</td>
                                            <td className="px-4 py-3">{order.node.status}</td>
                                        </tr>
                                    ))}

                                </table>
                            )}

                            { !orders && (
                                <div>
                                    No Orders Found
                                </div>
                            )}

                        </div>
                    )}
                </div>
            </div>
        </div >
    )
};

export default ProfilePage;
