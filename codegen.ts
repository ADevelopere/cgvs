import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "./client/graphql/generated/schema.graphql",
  documents: [
    "./client/graphql/sharedDocuments/**/*.ts",
    "./client/views/**/*.documents.ts",
  ],
  ignoreNoDocuments: true,
  generates: {
    "./client/graphql/generated/gql/": {
      preset: "client",
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
  },
};

export default config;
