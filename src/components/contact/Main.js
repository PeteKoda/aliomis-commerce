import { isEmpty } from 'lodash';
import { useState, useEffect } from 'react';
import axios from "axios"
import 'sal.js/dist/sal.css';
import sal from 'sal.js'

const Main = ({ data }) => {

    const [user, setUser] = useState({
        email: "",
        name: "",
        message: "",
    })

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const[emailResponse, setEmailResponse] = useState("")

    useEffect(()=>{
        sal()
    },[])

    if (isEmpty(data)) {
        return null;
    }

    function handleChange(event) {
        const newState = { ...user, [event.target.name]: event.target.value };
        setUser(newState);
    }

    function contactMessage(e) {
        if (!loading) {
            setLoading(true)

                if (user.name && user.email && user.message) {
                    setErrorMessage("")
                    axios.post(`https://w3.aliomis.com/wp-json/myplugin/v1/contactEmail`, user)
                        .then(function (response) {
                            setEmailResponse(response.data)
                            setLoading(false)

                        })
                        .catch(function (error) {
                            // handle error
                            setLoading(false)
                        })
                } else {
                    setErrorMessage("Παρακαλούμε συμπληρώστε όλα τα απαραίτητα πεδία")
                    setLoading(false)
                }


        }
    }

    return (
        <div className="container mx-auto py-20 md:py-32 px-4">
            <div className="flex flex-wrap">
                <div className="w-full sm:w-1/2 pr-0 sm:pr-8">
                    <div style={{ maxWidth: "510px" }}>
                        <span className="featured-s-p">{data.contact.subtitle}</span>
                        <h2 className="featured-s-h2">{data.contact.title}</h2>
                        <div>
                            <p>{data.contact.description}</p>
                        </div>
                        <div className="pt-4" dangerouslySetInnerHTML={{ __html: data.contact.storeDetails }} />
                    </div>
                </div>
                <div className="w-full sm:w-1/2 pt-8 sm:pt-0" data-sal="fade" data-sal-delay="300" data-sal-duration="1000" data-sal-easing="ease-out-back">
                    {emailResponse === "" && (
                        <div>
                            <div className="flex">
                                <div className="w-1/2 mr-4">
                                    <input style={{ outline: "none" }} className="shadow appearance-none border w-full py-2 px-3 text-grey-darker" value={user.name} onChange={handleChange} name="name" id="name" type="text" placeholder="Name" />
                                </div>

                                <div className="w-1/2 ml-4">
                                    <input style={{ outline: "none" }} className="shadow appearance-none border w-full py-2 px-3 text-grey-darker" value={user.email} onChange={handleChange} name="email" id="email" type="email" placeholder="Email" />
                                </div>
                            </div>
                            <textarea
                                className="shadow appearance-none border w-full py-2 px-3 text-grey-darker mt-8"
                                rows="6"
                                cols="50"
                                placeholder="Comments"
                                name="message"
                                value={user.message}
                                onChange={handleChange}
                            />
                            {!loading ?
                                <button onClick={contactMessage} className="bttn-default ml-auto">Send</button>
                                :
                                <button className="bttn-default ml-auto">Loading</button>
                            }
                        </div>
                    )}

                    {emailResponse !== "" && (
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <div className="contact-response" dangerouslySetInnerHTML={{ __html: emailResponse }}></div>
                            </div>
                        )}
                </div>
            </div>
        </div>
    )
}

export default Main
