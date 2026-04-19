import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  pluginJs.configs.recommended,
];
