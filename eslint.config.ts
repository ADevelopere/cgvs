import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "logs/**",
      "storage/**",
      ".cursor/**",
      "build/**",
      "dist/**",
      "out/**",
      "client/graphql/generated/**",
      "next-env.d.ts",
    ],
  },
  eslint.configs.recommended,
  // Use recommended rules WITHOUT type-aware linting for fast performance
  // Run `~/.bun/bin/bun tsc` separately for type checking
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-namespace": "off",
    },
  },
];
