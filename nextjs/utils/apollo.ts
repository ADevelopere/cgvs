import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
    from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getAuthToken } from "./auth";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

// const httpLink = createHttpLink({
//     uri: "http://localhost:8000/graphql",
//     credentials: "include", // This ensures cookies are sent with requests
//     headers: {
//         "X-Requested-With": "XMLHttpRequest",
//     },
// });

// Create an upload link that handles multipart requests for file uploads
const uploadLink = createUploadLink({
    uri: "http://localhost:8080/graphql",
    credentials: "include", // This ensures cookies are sent with requests
    headers: {
        "X-Requested-With": "XMLHttpRequest",
    },
});

const authLink = setContext((_, { headers }) => {
    const token = getAuthToken();
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

// Create the Apollo Client instance
const apolloClient = new ApolloClient({
    link: from([authLink, uploadLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: "cache-and-network",
        },
    },
    devtools: {
        enabled: true,
    },
});

export default apolloClient;
