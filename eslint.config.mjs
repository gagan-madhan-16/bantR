import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.{ts,tsx}"], // Target TypeScript files
    rules: {
      "@typescript-eslint/no-unused-vars": "off", // Disable the rule
      "@typescript-eslint/no-explicit-any": "off", // Disable the rule
      "react/no-unescaped-entities": "off", // Disable the unescaped entities rule
      "react-hooks/rules-of-hooks": "off",  // Disable hooks rules if necessary
      "react-hooks/exhaustive-deps": "off",
      "no-var": "off",
      "next/no-html-link-for-pages": "off",
      "react/no-unescaped-entities": "off",
    },
  },
];

export default eslintConfig;
