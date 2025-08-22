import {
    ApolloClient,
    InMemoryCache,
    from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { getAuthToken, clearAuthToken } from "./auth";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

// Create an upload link that handles multipart requests for file uploads
const uploadLink = createUploadLink({
    uri: "http://localhost:8080/graphql",
    credentials: "include", // This ensures cookies are sent with requests
    headers: {
        "X-Requested-With": "XMLHttpRequest",
    },
});

// Auth link to add JWT token to requests
const authLink = setContext((_, { headers }) => {
    const token = getAuthToken();
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

// Error link to handle authentication errors
const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        for (const err of graphQLErrors) {
            switch (err.extensions?.code) {
                case 'UNAUTHENTICATED':
                case 'UNAUTHORIZED':
                    // Clear auth token and redirect to login
                    clearAuthToken();
                    window.location.href = '/login';
                    break;
            }
        }
    }

    if (networkError) {
        console.error(`[Network error]: ${networkError}`);
        
        // Handle 401/403 network errors
        if ('statusCode' in networkError && 
            (networkError.statusCode === 401 || networkError.statusCode === 403)) {
            clearAuthToken();
            window.location.href = '/login';
        }
    }
});

// Create the Apollo Client instance
const apolloClient = new ApolloClient({
    link: from([errorLink, authLink, uploadLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: "cache-and-network",
            errorPolicy: "all",
        },
        query: {
            errorPolicy: "all",
        },
    },
    devtools: {
        enabled: true,
    },
});

export default apolloClient;
