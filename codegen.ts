import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "./client/graphql/generated/schema.graphql",
  documents: ["./client/graphql/sharedDocuments/**/*.ts", "./client/views/**/*.documents.ts"],
  ignoreNoDocuments: true,
  generates: {
    "./client/graphql/generated/gql/": {
      preset: "client",
      presetConfig: {
        fragmentMasking: false,
      },
      config: {
        dedupeFragments: true,
        onlyOperationTypes: false,
        enumsAsTypes: false,
        withRefetchFn: true,
        inlineFragmentTypes: false,
        preResolveTypes: true,
        extractAllFieldsToTypes: true,
        skipTypeNameForRoot: false,
        fragmentMasking: false,
      },
    },
  },
};

export default config;
