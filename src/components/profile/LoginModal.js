import { useState, useEffect, useContext } from 'react';
import { v4 } from 'uuid';
import { useQuery, useMutation } from '@apollo/client';
import { UserContext } from "../context/AppContext";
import validator from 'validator';
import cogoToast from "cogo-toast";

import LOG_IN_USER from "../../mutations/login";
import REGISTER_USER from "../../mutations/register-user";


const LoginModal = (props) => {

    const [loggedUser, setLoggedUser] = useContext(UserContext);

    const [user, setUser] = useState({
        email: "",
        password: "",
        repeatPassword: "",
        userName: ""
    })

    const [requestError, setRequestError] = useState(null);
    const [formError, setFormError] = useState("");


    const [activeForm, setActiveForm] = useState(props.openType);


    const [loginUser, { loading: logingInLoading, error: logingInError, data }] = useMutation(LOG_IN_USER, {
        variables: {
            input: {
                clientMutationId: v4(), // Generate a unique id.
                username: user.email,
                password: user.password
            },
        },
        onCompleted: (data) => {
            // console.warn( 'completed ADD_TO_CART' );

            // If error.
            if (logingInError && logingInError.graphQLErrors) {
                setRequestError(logingInError.graphQLErrors[0].message);
            }

            const { login } = data;
            const authData = {
                authToken: login.authToken,
                customer: login.customer,
                databaseId: login.databaseId,
            };

            localStorage.setItem('woo-user', JSON.stringify(authData));

            setLoggedUser(authData);

            props.closeModal()
            // setLoggedIn(true);

        },
        onError: (error) => {
            if (error) {
                if(error.graphQLErrors[ 0 ].message === "invalid_email"){
                    cogoToast.error( "The email is not valid." , {
                        position: 'top-center',
                        hideAfter: 3
                    })
                }else if(error.graphQLErrors[ 0 ].message === "incorrect_password"){
                    cogoToast.error( "The password is incorrect." , {
                        position: 'top-center',
                        hideAfter: 3
                    })
                }
                
                setRequestError(error.graphQLErrors[0].message);
            }
        }
    });

    const [registerUser, { loading: registerInLoading, error: registerInError, data2 }] = useMutation(REGISTER_USER, {
        variables: {
            input: {
                clientMutationId: v4(), // Generate a unique id.
                email: user.email,
                password: user.password,
                username: user.userName
            },
        },
        onCompleted: (data) => {
            // console.warn( 'completed ADD_TO_CART' );

            // If error.
            if (registerInError && registerInError.graphQLErrors && registerInError.graphQLErrors[0]) {
                setRequestError(registerInError.graphQLErrors[0].message);
            }

            console.log(data)

            const { registerCustomer } = data;

            registerCustomer.customer.name = registerCustomer.customer.username

            const authData = {
                authToken: registerCustomer.authToken,
                user: registerCustomer.customer,
            };

            console.log(authData)

            localStorage.setItem('woo-user', JSON.stringify(authData));

            setLoggedUser(authData);
            setLoggedIn(true);

        },
        onError: (error) => {
            if (error && error.graphQLErrors) {
                setRequestError(error.graphQLErrors[0].message);
            }
        }
    });

    function handleSubmit(event) {
        event.preventDefault()
        loginUser()
    }

    function handleSubmitRegister(event) {
        event.preventDefault()

        let min = 6;

        let max = 14

        let minU = 3;

        let maxU = 14

        if (user.password === user.repeatPassword) {
            if (!validator.isLength(user.password, { min, max })) {
                setFormError(`Password must be ${6} to ${14} characters`);
            }
        } else {
            setFormError(`Passwords does not match.`);
        }

        if (! validator.isEmail(user.email)) {
            setFormError("Email in invalid.")
        }

        if ( user.userName.length < 3 || user.userName.length > 14) {
            setFormError(`Username must be ${3} to ${14} characters`);
        }

        // password: "",
        // repeatPassword: "",
        // userName: ""

        console.log(user)
        if (validator.isLength(user.password, { min, max }) && user.password === user.repeatPassword && validator.isEmail(user.email) && !(user.userName.length < 3 || user.userName.length > 14)) {
            setFormError("")
            registerUser()
        }

        // registerUser()
    }

    function handleChange(event) {
        const newState = { ...user, [event.target.name]: event.target.value };
        setUser(newState);
    }

    return (
        <div>
            <div className=" pin flex items-center">
                <div className=" pin bg-black opacity-75 z-10"></div>

                <div className="relative md:mx-auto w-full z-20 ">
                    <div className="shadow-lg bg-white">
                        {/* <div className="flex justify-end mb-6">
                            <button onClick={props.closeModal}>
                                <span className="mr-2">Close</span>
                                <span>
                                </span>
                            </button>
                        </div> */}

                        <div className="flex">
                            <div onClick={() => setActiveForm(1)} className="w-1/2 text-center py-4 cursor-pointer" style={activeForm === 2 ? { backgroundColor: "#f4f2f2" } : { backgroundColor: "initial" }}>
                                <h1 className="text-center text-xl text-black ">Se connecter</h1>
                            </div>
                            <div onClick={() => setActiveForm(2)} className="w-1/2 text-center py-4 cursor-pointer" style={activeForm === 1 ? { backgroundColor: "#f4f2f2" } : { backgroundColor: "initial" }}>
                                <h1 className="text-center text-xl text-black">Créer son compte</h1>
                            </div>
                        </div>

                        {activeForm === 1 && (
                            <form onSubmit={handleSubmit} className="pt-6 pb-2 p-8" >
                                <div className="mb-6">
                                    <input style={{ outline: "none" }} className="shadow appearance-none border w-full py-2 px-3 text-grey-darker" value={user.email} onChange={handleChange} name="email" id="email" type="text" placeholder="Adresse email" />
                                </div>
                                <div className="mb-6">
                                    <input style={{ outline: "none" }} className="shadow appearance-none border w-full py-2 px-3 text-grey-darker mb-3" value={user.password} onChange={handleChange} name="password" id="password" type="password" placeholder="Mot de passe" />
                                </div>
                                <div className="block md:flex items-center justify-between pb-4">
                                    <div className="mt-4 md:mt-0">
                                        <a href="#" className="text-green no-underline">Mot de passe oublié ?</a>
                                    </div>
                                    <div>
                                        <button
                                            className="bttn-default text-black">
                                                Connexion
                                        </button>

                                        {logingInLoading && <p>Adding to Cart...</p>}
                                    </div>

                                </div>
                            </form>
                        )}

                        {activeForm === 2 && (
                            <form onSubmit={handleSubmitRegister} className="pt-6 pb-2 p-8" >
                                <div className="mb-6">
                                    <input style={{ outline: "none" }} className="shadow appearance-none border w-full py-2 px-3 text-grey-darker" value={user.userName} onChange={handleChange} name="userName" id="userName" type="text" placeholder="User Name" />
                                </div>
                                <div className="mb-6">
                                    <input style={{ outline: "none" }} className="shadow appearance-none border w-full py-2 px-3 text-grey-darker" value={user.email} onChange={handleChange} name="email" id="email" type="text" placeholder="Email Address" />
                                </div>
                                <div className="mb-6">
                                    <input style={{ outline: "none" }} className="shadow appearance-none border w-full py-2 px-3 text-grey-darker mb-3" value={user.password} onChange={handleChange} name="password" id="password" type="password" placeholder="Password" />
                                </div>
                                <div className="mb-6">
                                    <input style={{ outline: "none" }} className="shadow appearance-none border w-full py-2 px-3 text-grey-darker mb-3" value={user.repeatPassword} onChange={handleChange} name="repeatPassword" id="repeatPassword" type="password" placeholder="Repeat Password" />
                                </div>
                                {formError !== "" && (
                                    <p className="text-center" style={{color:"red"}}>{formError}</p>
                                )}
                                <div className="block md:flex items-center justify-between pb-4">
                                    <div className="mt-4 md:mt-0">
                                        <a href="#" className="text-green no-underline">Lost your Password?</a>
                                    </div>
                                    <div>
                                        <button
                                            className="bttn-default text-black">
                                            Register
                                        </button>
                                        {logingInLoading && <p>De liaison...</p>}
                                    </div>

                                </div>
                                { requestError && (
                                    <div className="register-error" dangerouslySetInnerHTML={{__html: requestError}} />
                                )}
                            </form>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
};

export default LoginModal;
