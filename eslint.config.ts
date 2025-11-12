import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import sonarjs from "eslint-plugin-sonarjs";
import cspellESLintPluginRecommended from "@cspell/eslint-plugin/recommended";

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
  sonarjs.configs.recommended,
  cspellESLintPluginRecommended,
  // Use recommended rules WITHOUT type-aware linting for fast performance
  // Run `~/.bun/bin/bun tsc` separately for type checking
  // ...tseslint.configs.recommended,

  // Use `recommended` with a type-aware config set.
  // `strictTypeChecked` is the strongest.
  ...tseslint.configs.strictTypeChecked,
  // Tell ESLint where your tsconfig.json is so it can
  // enable type-aware rules.
  {
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
  },

  {
    rules: {
      // Note: you must disable the base rule as it can report incorrect errors
      "no-throw-literal": "off",
      "@typescript-eslint/only-throw-error": "info",

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-namespace": "off",

      /**
       * Bans the `!` (non-null assertion) operator.
       * This is the #1 source of your runtime null errors.
       */
      "@typescript-eslint/no-non-null-assertion": "error",

      /**
       * Bans the `any` keyword, forcing you to use the safer `unknown`.
       * `any` disables all null checking.
       */
      "@typescript-eslint/no-explicit-any": "error",

      // 3. (Optional) Customize the rule severity
      "@cspell/spellchecker": [
        "warn",
        {
          autoFix: true,
          configFile: new URL("./cspell.config.yaml", import.meta.url).toString(),
          cspellOptionsRoot: import.meta.url,
        },
      ], // Use "warn" instead of "error"
    },
  },
];
