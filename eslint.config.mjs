import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier/flat";
import importPlugin from "eslint-plugin-import";

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      // Disable overly strict rule for quotes/apostrophes in JSX text
      "react/no-unescaped-entities": "off",
      // Allow anonymous exports in config files
      "import/no-anonymous-default-export": "off",
      
      // Import ordering - auto-fix on save
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling"],
            "index",
          ],
          pathGroups: [
            {
              pattern: "react",
              group: "external",
              position: "before",
            },
            {
              pattern: "next/**",
              group: "external",
              position: "before",
            },
            {
              pattern: "@/styles/**",
              group: "index",
              position: "after",
            },
            {
              pattern: "@/types/**",
              group: "internal",
            },
            {
              pattern: "@/lib/**",
              group: "internal",
            },
            {
              pattern: "@/utils/**",
              group: "internal",
            },
            {
              pattern: "@/contexts/**",
              group: "internal",
            },
            {
              pattern: "@/components/**",
              group: "internal",
            },
            {
              pattern: "@/app/**",
              group: "internal",
            },
          ],
          pathGroupsExcludedImportTypes: ["react"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  // Disable ESLint rules that conflict with Prettier
  prettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
