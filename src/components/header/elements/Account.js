import Link from "next/link";
import data from "@data/account-menu.json";
import { useState, useContext, useEffect } from 'react';
import Modal from 'react-modal';
import LoginModal from '@components/profile/LoginModal';
import { useMutation } from '@apollo/client';
import { v4 } from 'uuid';
import { UserContext } from "@components/context/AppContext";
import REFRESH_TOKEN from '@mutations/refreshToken'


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        width: "100%",
        zIndex: "99999999999999",
        background: "transparent!important",
        maxWidth: "400px",
        margin: "0",
        padding: "0"
    }
};

const Account = ({ className, isHidden, openHandler, closeHandler }) => {
    const [loggedUser, setLoggedUser] = useContext(UserContext);

    const [modalIsOpen, setIsOpen] = useState(false);
    const [openType, setOpenType] = useState(1);

    const [refreshToken, { data: rtResponse, loading: rtLoading, error: rtError }] = useMutation(REFRESH_TOKEN, {
        variables: {
            input: {
                clientMutationId: v4(),
                jwtRefreshToken: loggedUser ? loggedUser.authToken : '',
            }
        },
        onCompleted: (data) => {
            console.log("REFRESHHHHHHHHHHHHHHHHHHHHHHHHHHHH")
            console.log(data.refreshJwtAuthToken.authToken)

            let localUser = (process.browser && typeof localStorage !== 'undefined') ? localStorage.getItem("woo-user") : null;
            localUser = JSON.parse(localUser).user

            let authData = {
                authToken: data.refreshJwtAuthToken.authToken,
                user: localUser,
            };

            localStorage.setItem('woo-user', JSON.stringify(authData));

            setLoggedUser(authData);

            refetch();
        },
        onError: (error) => {
            if (error && error.graphQLErrors) {
                console.log(error)
                // setRequestError( error.graphQLErrors[ 0 ].message );
            }
        }
    });


    useEffect(() => {
        setTimeout(() => {
            if (loggedUser && loggedUser.authToken) {
                refreshToken()
            }
        }, 500000)

        if (loggedUser) {
            closeModal()
        }
    }, [loggedUser])



    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    function caseAction(cs) {
        if (cs === "login") {
            setOpenType(1)
            openModal()
        }else if ( cs === "register") {
            setOpenType(2)
            openModal()
        }else if(cs === "logout"){
            localStorage.removeItem('woo-user');
            window.location.reload();
        }
    }

    return (
        <div className={`tt-parent-box ${className}`}>
            <div className={`tt-account tt-dropdown-obj ${!isHidden ? 'active' : null}`}>
                <button className="tt-dropdown-toggle" data-id="account" onClick={openHandler} >
                    { loggedUser && loggedUser.customer
                        ?
                        <div className="user-icon" data-id="account" style={{ zIndex: "9", position: "relative" }}>
                            <div data-id="account">{loggedUser.customer.username[0]}</div>
                        </div>
                        :
                        <i className="icon-f-94" />
                    }
                </button>
                <div className="tt-dropdown-menu">
                    <div className="tt-mobile-add">
                        <button className="tt-close" data-id="account" onClick={closeHandler}>Close</button>
                    </div>
                    <div className="tt-dropdown-inner">
                        <ul>
                            {data.map(item => {
                                if (!item.authenticated && !loggedUser ) {
                                    return (
                                        <li key={item.id}>
                                            {item.action
                                                ?
                                                <a onClick={() => caseAction(item.action)}><i className={item.iconClass} />{item.text}</a>
                                                :
                                                <Link href={item.link}>
                                                    <a><i className={item.iconClass} />{item.text}</a>
                                                </Link>
                                            }
                                        </li>
                                    )
                                } else if (item.authenticated && loggedUser && loggedUser.customer) {
                                    return (
                                        <li key={item.id}>
                                            {item.action
                                                ?
                                                <a onClick={() => caseAction(item.action)}><i className={item.iconClass} />{item.text}</a>
                                                :
                                                <Link href={item.link}>
                                                    <a><i className={item.iconClass} />{item.text}</a>
                                                </Link>
                                            }
                                        </li>
                                    )
                                }
                            })}

                        </ul>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <LoginModal closeModal={closeModal} openType={openType} />
            </Modal>

        </div>
    );
};

export default Account;
