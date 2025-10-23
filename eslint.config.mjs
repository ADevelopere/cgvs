// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
// import storybook from "eslint-plugin-storybook";

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import graphqlPlugin from "@graphql-eslint/eslint-plugin";
import graphqlParser from "@graphql-eslint/parser";

const tsEslintModule = await import("@typescript-eslint/eslint-plugin");
const tsEslintPlugin = tsEslintModule.default;
const tsEslintRecommended = tsEslintModule.default.configs.recommended;
const tsEslintParser = (await import("@typescript-eslint/parser")).default;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "client/graphql/generated/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    files: ["**/*.graphql"],
    languageOptions: {
      parser: graphqlParser,
    },
    plugins: {
      "@graphql-eslint": graphqlPlugin,
    },
    rules: {
      "@graphql-eslint/known-type-names": "error",
      "@graphql-eslint/no-unused-fragments": "error",
      "@graphql-eslint/no-unused-variables": "error",
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: [".storybook/**"],
    languageOptions: {
      parser: tsEslintParser,
      parserOptions: {
        // Disabled type-aware linting to prevent memory exhaustion
        // Run `bun tsc` separately for type checking
        // project: "./tsconfig.json",
        // tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      "@typescript-eslint": tsEslintPlugin,
    },
    rules: {
      ...tsEslintRecommended.rules,
      "no-console": "error",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    // Prevent server imports in client code
    files: ["client/**/*.ts", "client/**/*.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/server/**", "@/server/**"],
              message:
                "Client code cannot import from server directories. Keep server-side code separate from client-side code.",
            },
          ],
        },
      ],
    },
  },
  {
    // Prevent client imports in server code
    files: ["server/**/*.ts", "server/**/*.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/client/**", "@/client/**"],
              message:
                "Server code cannot import from client directories. Keep client-side code separate from server-side code.",
            },
          ],
        },
      ],
    },
  },
  {
    // files: [".storybook/**/*.ts", ".storybook/**/*.tsx"],
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
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": "error",
    },
  },
  // ...storybook.configs["flat/recommended"],
];

export default eslintConfig;
