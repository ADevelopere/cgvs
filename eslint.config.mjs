
// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import graphqlPlugin from "@graphql-eslint/eslint-plugin";

const tsEslintModule = await import("@typescript-eslint/eslint-plugin");
const tsEslintPlugin = tsEslintModule.default;
const tsEslintRecommended = tsEslintModule.default.configs.recommended;
const tsEslintParser = (await import("@typescript-eslint/parser")).default;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [{
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"]
}, ...compat.extends("next/core-web-vitals", "next/typescript"), {
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
}, {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: [".storybook/**"],
    languageOptions: {
        parser: tsEslintParser,
        parserOptions: {
            project: "./tsconfig.json",
            tsconfigRootDir: __dirname,
        },
    },
    plugins: {
        "@typescript-eslint": tsEslintPlugin,
    },
    rules: {
        ...tsEslintRecommended.rules,
        "no-console": "error",
    },
}, {
    files: [".storybook/**/*.ts", ".storybook/**/*.tsx"],
    languageOptions: {
        parser: tsEslintParser,
        parserOptions: {
            // Don't use project-based linting for storybook files
            // to avoid the tsconfig include issues
        },
    },
    plugins: {
        "@typescript-eslint": tsEslintPlugin,
    },
    rules: {
        // Use basic rules without type-aware linting
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/no-explicit-any": "warn",
        "no-console": "error",
    },
}, ...storybook.configs["flat/recommended"]];

export default eslintConfig;
