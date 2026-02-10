/** @type {import("prettier").Config} */
const config = {
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
  printWidth: 80,
  arrowParens: "always",
  endOfLine: "lf",
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  // Import sorting configuration
  importOrder: [
    "<BUILTIN_MODULES>",
    "",
    "^react$",
    "^next(/.*)?$",
    "",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@/types/(.*)$",
    "^@/lib/(.*)$",
    "^@/utils/(.*)$",
    "",
    "^@/contexts/(.*)$",
    "",
    "^@/components/(.*)$",
    "^@/app/(.*)$",
    "",
    "^[./]",
    "",
    "^.+\\.(css|scss|sass)$",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "5.0.0",
};

export default config;
