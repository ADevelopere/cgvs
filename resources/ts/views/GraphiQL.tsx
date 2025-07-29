import React from "react";
import { GraphiQL } from "graphiql";
import "graphiql/graphiql.css";
import { getAuthToken } from "../utils/auth";

const GraphiQLApp: React.FC = () => {
    const fetcher = async (graphQLParams: any) => {
        const token = getAuthToken();
        const data = await fetch("/graphql", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "X-CSRF-TOKEN":
                    document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content") || "",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(graphQLParams),
            credentials: "include",
        });
        return data.json().catch(() => data.text());
    };

    return (
        <div
            style={{
                height: "calc(100vh)",
                width: "100%",
                direction: "ltr",
            }}
        >
            <GraphiQL fetcher={fetcher} />
        </div>
    );
};

export default GraphiQLApp;
