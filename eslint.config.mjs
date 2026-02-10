import nextVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier/flat";
import importPlugin from "eslint-plugin-import";
import { defineConfig } from "eslint/config";

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      "react/no-unescaped-entities": "off",
      "import/no-anonymous-default-export": "off",
      // Enforce path aliases for imports outside current folder
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../**/components/*", "../../components/*"],
              message:
                "Use path alias (@/components/...) instead of relative imports for components outside current folder.",
            },
            {
              group: ["../**/contexts/*", "../../contexts/*"],
              message:
                "Use path alias (@/contexts/...) instead of relative imports for contexts.",
            },
            {
              group: ["../**/utils/*", "../../utils/*"],
              message:
                "Use path alias (@/utils/...) instead of relative imports for utils.",
            },
            {
              group: ["../**/types/*", "../../types/*"],
              message:
                "Use path alias (@/types/...) instead of relative imports for types.",
            },
            {
              group: ["../**/lib/*", "../../lib/*"],
              message:
                "Use path alias (@/lib/...) instead of relative imports for lib.",
            },
          ],
        },
      ],
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling"],
            "index",
            "type",
          ],
          pathGroups: [
            // 1. External packages (default builtin/external)
            // 2. React (after other external)
            {
              pattern: "react",
              group: "external",
              position: "after",
            },
            {
              pattern: "react-**",
              group: "external",
              position: "after",
            },
            // 3. Next.js (after React)
            {
              pattern: "next",
              group: "external",
              position: "after",
            },
            {
              pattern: "next/**",
              group: "external",
              position: "after",
            },
            // 4. Contexts
            {
              pattern: "@/contexts/**",
              group: "internal",
              position: "before",
            },
            // 5. Components
            {
              pattern: "@/components/**",
              group: "internal",
              position: "before",
            },
            // 6. Hooks (assuming they're in a hooks folder)
            {
              pattern: "@/hooks/**",
              group: "internal",
              position: "before",
            },
            // 7. Utils/helpers
            {
              pattern: "@/utils/**",
              group: "internal",
              position: "before",
            },
            {
              pattern: "@/lib/**",
              group: "internal",
              position: "before",
            },
            // 8. Types
            {
              pattern: "@/types/**",
              group: "type",
              position: "before",
            },
            // 9. Styles (last)
            {
              pattern: "@/styles/**",
              group: "index",
              position: "after",
            },
            {
              pattern: "**/*.css",
              group: "index",
              position: "after",
            },
            {
              pattern: "**/*.scss",
              group: "index",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["react", "react-**"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  prettier,
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
]);

export default eslintConfig;
