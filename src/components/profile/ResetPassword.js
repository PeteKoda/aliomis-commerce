import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';

import RESET_USER_PASSWORD_MUTATION from "../../mutations/reset-password-confirmed"

import { v4 } from 'uuid';

    const ResetPassword = (props) => {

    const [requestError, setRequestError] = useState(null);

    const [user, setUser] = useState({
        password: "",
        key: "",
        login: ""
    })

    const [resetPassword, { loading: rpLoading, error: rpError, data }] = useMutation(RESET_USER_PASSWORD_MUTATION, {
        variables: {
            input: { ...user },
        },
        onCompleted: (data) => {
            // console.warn( 'completed ADD_TO_CART' );

            // If error.
            if (rpError && rpError.graphQLErrors) {
                setRequestError(rpError.graphQLErrors[0].message);
            }

        },
        onError: (error) => {
            if (error) {
                setRequestError(error.graphQLErrors[0].message);
            }
        }
    });

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        let login = urlParams.get('login');
        let key = urlParams.get('key');

        if( key && login){
            setUser({...user , login: login , key: key, clientMutationId: v4()})
        }else{
            alert("Loipoun pramata")
        }

    },[])

    function handleSubmit(event) {
        event.preventDefault()
        console.log(user)
        resetPassword()
    }

    function handleChange(event) {
        const newState = { ...user, [event.target.name]: event.target.value };
        setUser(newState);
    }

    const { productCategories } = props;

    return (
            <div>
                <form onSubmit={handleSubmit} className="pt-6 pb-2 my-2 my-32 p-8 mx-auto" style={{maxWidth: "500px"}} >
                    <div className="mb-6">
                        <input style={{ outline: "none" }} className="shadow appearance-none border w-full py-2 px-3 text-grey-darker mb-3" value={user.password} onChange={handleChange} name="password" id="password" type="password" placeholder="New Password" />
                    </div>
                    <div className="block md:flex items-center justify-between pb-4">
                        <div>
                            <button className="bttn-default text-black">
                                Sign In
                            </button>
                        </div>

                    </div>
                </form>
            </div>
    )
};

export default ResetPassword;
