import React, { useEffect } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { createCheckoutData } from "../../functions";
import { useRouter } from "next/router";



import { gql, useMutation } from '@apollo/client'

const CHECKOUT = gql`
  mutation Checkout($input: CheckoutInput!) {
    checkout(input: $input) {
      order {
        databaseId
      }
    }
  }
`



const StripeForm = (props) => {

    const router = useRouter()

    // This loads up the Stripe object
    const stripe = useStripe()

    const [checkout] = useMutation(CHECKOUT)

    // Used to pass the payment info to the Stripe API
    const elements = useElements()

    // We'll deal with this in a sec
    async function handleSubmit(event) {
        event.preventDefault()
        try {
            const source = await handleStripe()

            let checkOutData = createCheckoutData(props.input, props.shippingInput, props.shipToDifferentAddress)

            await checkout({
                variables: {
                    input: {
                        ...checkOutData,
                        metaData: [
                            {
                                key: `_stripe_source_id`,
                                value: source.id,
                            },
                        ],
                    },
                },
            })

            props.setLoadingPayment(false)

            router.push({
                pathname: `/thank-you/`,
            }, undefined, { shallow: true });

        } catch (error) {
            props.setLoadingPayment(false)
            console.error(error)
        }
    }

    async function handleStripe() {
        // Guard against stripe or elements not being available
        if (!stripe || !elements) {
            throw Error(`stripe or elements undefined`)
        }

        // Extract the payment data from our <CardElement/> component
        const cardElements = elements.getElement(CardElement)

        // Guard against an undefined value
        if (!cardElements) {
            throw Error(`cardElements not found`)
        }

        // Create the Source object
        const { source, error: sourceError } = await stripe.createSource(
            cardElements,
            {
                type: `card`,
            }
        )

        // Guard against and error or undefined source
        if (sourceError || !source) {
            throw Error(sourceError?.message || `Unknown error generating source`)
        }

        return source
    }

    return (
        <div className="mt-4">
            {/* CardElement will load up the necessary CC fields */}
            <div 
                style={{
                    textAlign: "center",
                    fontSize: "1.25rem",
                    paddingBottom: "0.5rem"
                }}>
                    Pay with card
            </div>
            <CardElement
                options={{
                    hidePostalCode: true, // We'll be sending up the postal ourselves
                }}
            />
            <button className="bttn-default mx-auto mt-4" disabled={!stripe} onClick={(e) => handleSubmit(e)}>Pay {props.total}€</button>
        </div>
    )
}


export default StripeForm