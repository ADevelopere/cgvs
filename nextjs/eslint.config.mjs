import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import graphqlPlugin from "@graphql-eslint/eslint-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        files: ["**/*.graphql"],
        languageOptions: {
            parser: graphqlPlugin.parser,
        },
        plugins: {
            "@graphql-eslint": graphqlPlugin,
        },
        rules: {
            "@graphql-eslint/known-type-names": "error",
            // ... other GraphQL-ESLint rules
        },
    },
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: "@typescript-eslint/parser",
            parserOptions: {
                project: "./tsconfig.json",
                tsconfigRootDir: __dirname,
            },
        },
        plugins: {
            "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
        },
        rules: {
            ...require("@typescript-eslint/eslint-plugin").configs.recommended
                .rules,
            "no-console": "error",
        },
    },
];

export default eslintConfig;
