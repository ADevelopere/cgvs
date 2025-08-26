import { RefreshTokenDocument } from "@/graphql/generated/graphql";
import {
    ApolloClient,
    ApolloLink,
    CombinedGraphQLErrors,
    CombinedProtocolErrors,
    from,
    HttpLink,
    InMemoryCache,
    Observable,
} from "@apollo/client";
import { print } from "graphql/language/printer";
import { SetContextLink } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";

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

const authLink = new SetContextLink((prevContext, operation) => {
    const token = getAuthToken();
    return {
        headers: {
            ...prevContext.headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

let isRefreshing = false;
let pendingRequests: ((accessToken: string) => void)[] = [];

const resolvePendingRequests = (accessToken: string) => {
    pendingRequests.forEach((callback) => callback(accessToken));
    pendingRequests = [];
};

const errorLink = new ErrorLink(({ error, operation, forward }) => {
    if (CombinedGraphQLErrors.is(error)) {
        for (const err of error.errors) {
            if (err.extensions?.code === "UNAUTHENTICATED") {
                if (isRefreshing) {
                    return new Observable((observer) => {
                        pendingRequests.push((accessToken: string) => {
                            operation.setContext(({ headers = {} }) => ({
                                headers: {
                                    ...headers,
                                    authorization: `Bearer ${accessToken}`,
                                },
                            }));
                            forward(operation).subscribe(observer);
                        });
                    });
                }

                isRefreshing = true;

                return new Observable((observer) => {
                    fetch(GRAPHQL_ENDPOINT, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({
                            query: print(RefreshTokenDocument),
                        }),
                    })
                        .then((res) => res.json())
                        .then((response) => {
                            const newAccessToken =
                                response.data?.refreshToken?.token;
                            if (newAccessToken) {
                                updateAuthToken(newAccessToken);
                                resolvePendingRequests(newAccessToken);
                                operation.setContext(({ headers = {} }) => ({
                                    headers: {
                                        ...headers,
                                        authorization: `Bearer ${newAccessToken}`,
                                    },
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
    } else if (CombinedProtocolErrors.is(error)) {
        for (const err of error.errors) {
            console.error(
                `[Protocol error]: Message: ${err.message}, Extensions: ${JSON.stringify(err.extensions)}`,
            );
        }
    } else {
        // Network error
        console.error(`[Network error]: ${error}`);
        // Try to extract statusCode if available
        if (
            (error as any).statusCode === 401 ||
            (error as any).statusCode === 403
        ) {
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
