import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    overwrite: true,
    schema: "http://localhost:8080/graphql",
    documents: [
        // "./resources/ts/**/*.ts",
        // "./resources/ts/**/*.tsx",
        // "./graphql/graphql-ts/**/*.ts",
    ],
    generates: {
        "../nextjs/graphql/generated/types.ts": {
            plugins: [
                "typescript",
                "typescript-operations",
                "typescript-react-apollo",
            ],
            config: {
                withHooks: true,
                dedupeFragments: true,
                onlyOperationTypes: false,
                enumsAsTypes: true,
                withRefetchFn: true,
                inlineFragmentTypes: false,
                preResolveTypes: true,
                extractAllFieldsToTypes: false,
                skipTypeNameForRoot: false,
            },
        },
        "../graphql/generated/graphql.schema.json": {
            plugins: ["introspection"],
        },
        "../graphql/generated/schema.graphql": {
            plugins: ["schema-ast"],
        },
    },
};

export default config;
