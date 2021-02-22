import fetch from 'node-fetch';

import { ApolloClient, ApolloLink, InMemoryCache, createHttpLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";


/**
 * Middleware operation
 * If we have a session token in localStorage, add it to the GraphQL request as a Session header.
 */
export const middleware = new ApolloLink((operation, forward) => {
    /**
     * If session data exist in local storage, set value as session header.
     */
    const session = (process.browser && typeof localStorage !== 'undefined') ? localStorage.getItem("woo-session") : null;

    let token = (process.browser && typeof localStorage !== 'undefined') ? localStorage.getItem("woo-user") : null;

    if (token) {
        token = JSON.parse(token).authToken
    }

    if (session && token) {
        operation.setContext(({ headers = {} }) => ({
            headers: {
                "woocommerce-session": `Session ${session}`,
                "Authorization": `Bearer ${token}`
            },
        }));
    } else if (session) {
        operation.setContext(({ headers = {} }) => ({
            headers: {
                "woocommerce-session": `Session ${session}`,
            },
        }));
    }


    return forward(operation);

});

/**
 * Afterware operation.
 *
 * This catches the incoming session token and stores it in localStorage, for future GraphQL requests.
 */
export const afterware = new ApolloLink((operation, forward) => {

    return forward(operation).map(response => {
        /**
         * Check for session header and update session in local storage accordingly.
         */
        const context = operation.getContext();
        const { response: { headers } } = context;
        const session = headers.get("woocommerce-session");

        if (session) {

            // Remove session data if session destroyed.
            if (process.browser && typeof localStorage !== 'undefined') {
                if ("false" === session) {

                    localStorage.removeItem("woo-session");

                    // Update session new data if changed.
                } else if (localStorage.getItem("woo-session") !== session) {

                    localStorage.setItem("woo-session", headers.get("woocommerce-session"));

                }
            }
        }

        return response;

    });
});

const getNewToken = () => {
    return apolloClient.query({ query: GET_TOKEN_QUERY }).then((response) => {
        // extract your accessToken from your response data and return it
        const { accessToken } = response.data;
        return accessToken;
    });
};

const errorLink = onError(
    ({ graphQLErrors, networkError, operation, forward }) => {
        if (graphQLErrors) {
            // console.log("!!!!!!!!@!@!@!@!@!@!")
            // console.log(graphQLErrors)
            // console.log(operation.getContext().headers)
            // console.log(operation)

            for (let err of graphQLErrors) {
                switch (err.extensions.category) {
                    case "internal":
                        const session = (process.browser && typeof localStorage !== 'undefined') ? localStorage.getItem("woo-session") : null;

                        let token = (process.browser && typeof localStorage !== 'undefined') ? localStorage.getItem("woo-user") : null;

                        if (token) {
                            localStorage.removeItem("woo-user")
                        }

                        if (session && token) {
                            operation.setContext(({ headers = {} }) => ({
                                headers: {
                                    "woocommerce-session": `Session ${session}`,
                                },
                            }));
                        } else if (session) {
                            operation.setContext(({ headers = {} }) => ({
                                headers: {
                                    "woocommerce-session": `Session ${session}`,
                                },
                            }));
                        }
                        return forward(operation);
                }
            }
        }
    }
);

// Apollo GraphQL client.
const client = new ApolloClient({
    link: middleware.concat(afterware.concat(errorLink.concat(createHttpLink({
        uri: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/graphql`,
        fetch: fetch
    })))),
    cache: new InMemoryCache(),
});

export default client;
