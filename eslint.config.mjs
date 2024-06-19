import globals from "globals";
import pluginJs from "@eslint/js";
export default [
  pluginJs.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: { globals: globals.es2024 },
    rules: {
      "no-unused-vars": "off",
      "no-undef": 'off',
      "no-case-declarations": "off",
      "no-unreachable": "off",
      "no-empty": "off"
    }
  }
];
