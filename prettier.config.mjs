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
  // Import ordering: external → react → next → contexts → components → hooks → utils → types → styles
  importOrder: [
    // 1. Built-in Node modules
    "<BUILTIN_MODULES>",
    "",
    // 2. External packages (excluding React and Next)
    "^(?!react)(?!next)[a-zA-Z].*$",
    "<THIRD_PARTY_MODULES>",
    "",
    // 3. React
    "^react(-.*)?$",
    "",
    // 4. Next.js
    "^next(/.*)?$",
    "",
    // 5. Contexts
    "^@/contexts/(.*)$",
    "",
    // 6. Components
    "^@/components/(.*)$",
    "",
    // 7. Hooks
    "^@/hooks/(.*)$",
    "",
    // 8. Utils/Helpers
    "^@/utils/(.*)$",
    "^@/lib/(.*)$",
    "",
    // 9. Types
    "^@/types/(.*)$",
    "",
    // 10. Relative imports
    "^[./]",
    "",
    // 11. Styles (last)
    "^.+\\.(css|scss|sass)$",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "5.0.0",
};

export default config;
