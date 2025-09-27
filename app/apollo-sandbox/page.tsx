"use client";
import { ApolloSandbox } from "@apollo/sandbox/react";
import "./styles.css";

export default function Page() {
    return (
        <div className="apollo-sandbox-wrapper">
            <ApolloSandbox
                initialEndpoint="http://localhost:3000/api/graphql"
                className={"apollo-sandbox"}
            />
        </div>
    );
}
