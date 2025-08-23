import {
    ApolloClient,
    ApolloLink,
    from,
    HttpLink,
    InMemoryCache,
    Observable
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { RefreshTokenDocument } from "@/graphql/generated/types";
import { print } from "graphql/language/printer";

// --- Internal Token Management ---
let inMemoryToken: string | null = null;

export const updateAuthToken = (token: string) => {
    inMemoryToken = token;
};

const getAuthToken = (): string | null => {
    return inMemoryToken;
};

const clearAuthToken = () => {
    inMemoryToken = null;
};

export const clearClientAuth = () => {
    clearAuthToken();
};
// --- End Internal Token Management ---

// Configuration
const GRAPHQL_ENDPOINT = "http://localhost:8080/graphql";

const httpLink = new HttpLink({
    uri: GRAPHQL_ENDPOINT,
    credentials: "include", // CRITICAL: This allows the browser to send and receive cookies.
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

let isRefreshing = false;
let pendingRequests: ((accessToken: string) => void)[] = [];

const resolvePendingRequests = (accessToken: string) => {
    pendingRequests.forEach(callback => callback(accessToken));
    pendingRequests = [];
};

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
        for (const err of graphQLErrors) {
            if (err.extensions?.code === "UNAUTHENTICATED") {
                if (isRefreshing) {
                    return new Observable(observer => {
                        pendingRequests.push((accessToken: string) => {
                            operation.setContext(({ headers = {} }) => ({
                                headers: { ...headers, authorization: `Bearer ${accessToken}` },
                            }));
                            forward(operation).subscribe(observer);
                        });
                    });
                }

                isRefreshing = true;

                return new Observable(observer => {
                    // We use a raw fetch here because we don't want the authLink to apply.
                    fetch(GRAPHQL_ENDPOINT, {
                        method: "POST",
                        headers: { 'Content-Type': 'application/json' },
                        credentials: "include", // Must be included to send the refresh token cookie.
                        body: JSON.stringify({ query: print(RefreshTokenDocument) }),
                    })
                    .then(res => res.json())
                    .then(response => {
                        const newAccessToken = response.data?.refreshToken?.token;
                        if (newAccessToken) {
                            updateAuthToken(newAccessToken);
                            resolvePendingRequests(newAccessToken);
                            operation.setContext(({ headers = {} }) => ({
                                headers: { ...headers, authorization: `Bearer ${newAccessToken}` },
                            }));
                            forward(operation).subscribe(observer);
                        } else {
                            throw new Error("Refresh token failed");
                        }
                    })
                    .catch(() => {
                        clearAuthToken();
                        window.location.href = "/login";
                        observer.error(new Error("Refresh token failed"));
                    })
                    .finally(() => {
                        isRefreshing = false;
                    });
                });
            }
        }
    }

    if (networkError) {
        console.error(`[Network error]: ${networkError}`);
        if ("statusCode" in networkError && (networkError.statusCode === 401 || networkError.statusCode === 403)) {
            clearAuthToken();
            window.location.href = "/login";
        }
    }
});

const apolloClient = new ApolloClient({
    link: from([errorLink, authLink, httpLink as unknown as ApolloLink]),
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
});

export default apolloClient;
