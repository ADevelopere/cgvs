function getNextDevServerUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.NODE_ENV === "production" && !envUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL must be set in production mode");
  }
  
  const url = envUrl ?? "http://localhost:3000";
  
  // Validate URL format
  try {
    const parsedUrl = new URL(url);
    
    // Ensure protocol is http or https
    if (!parsedUrl.protocol.match(/^https?:$/)) {
      throw new Error(`Invalid protocol in NEXT_PUBLIC_BASE_URL: ${parsedUrl.protocol}. Must be http: or https:`);
    }
    
    // Validate hostname is present
    if (!parsedUrl.hostname) {
      throw new Error("NEXT_PUBLIC_BASE_URL must include a valid hostname");
    }
    
    // Return the URL without trailing slashes (port is preserved by URL constructor)
    return `${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.pathname.replace(/\/+$/, "")}`;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Invalid NEXT_PUBLIC_BASE_URL format: ${url}. Must be a valid URL (e.g., http://localhost:3000 or https://domain.com:8080)`);
    }
    throw error;
  }
}

export const NEXT_PUBLIC_BASE_URL = getNextDevServerUrl();

export function getGraphQLEndpoint(): string {
  const GRAPHQL_PATH = "/api/graphql";
  const graphqlEndpoint = `${NEXT_PUBLIC_BASE_URL.replace(/\/+$/, "")}${GRAPHQL_PATH}`;
  return graphqlEndpoint;
}

export const GRAPHQL_ENDPOINT = getGraphQLEndpoint();
