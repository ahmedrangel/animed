import withNuxt from "../.nuxt/eslint.config.mjs";

export default withNuxt([{
  files: ["**/*.vue", "**/*.js", "**/*.ts", "**/*.mjs"],
  ignores: [
    "node_modules/**/*",
    ".nuxt/**/*",
    "dist/**/*",
    ".output/**/*"
  ],
  rules: {
    "camelcase": "off",
    "no-console": ["error", { allow: ["info", "warn"] }],
    "sort-imports": ["error", { ignoreDeclarationSort: true }],
    "@stylistic/indent": ["error", 2, { SwitchCase: 1 }],
    "@stylistic/linebreak-style": ["error", process.platform === "win32" ? "windows" : "unix"],
    "@stylistic/quotes": ["error", "double"],
    "@stylistic/semi": ["error", "always"],
    "@stylistic/comma-dangle": ["error", "never"],
    "@stylistic/space-before-function-paren": ["error", "always"],
    "@stylistic/multiline-ternary": ["error", "never"],
    "@stylistic/member-delimiter-style": ["error", { multiline: { delimiter: "semi" }, singleline: { delimiter: "comma" } }],
    "@stylistic/arrow-spacing": ["error", { before: true, after: true }],
    "@stylistic/brace-style": ["error", "stroustrup", { allowSingleLine: true }],
    "@stylistic/no-multi-spaces": "error",
    "@stylistic/space-before-blocks": "error",
    "@stylistic/no-trailing-spaces": "error",
    "@stylistic/no-extra-semi": "error",
    "@stylistic/eol-last": ["error", "always"],
    "nuxt/prefer-import-meta": "error",
    "vue/first-attribute-linebreak": ["error", { singleline: "ignore", multiline: "ignore" }],
    "vue/max-attributes-per-line": ["error", { singleline: 100 }],
    "vue/singleline-html-element-content-newline": ["off"],
    "vue/no-multiple-template-root": ["off"],
    "vue/html-closing-bracket-spacing": ["error", { selfClosingTag: "always" }],
    "@typescript-eslint/no-explicit-any": ["off"],
    "@typescript-eslint/no-dynamic-delete": ["off"],
    "@typescript-eslint/ban-ts-comment": ["off"],
    "vue/html-indent": ["error", 2],
    "vue/multiline-html-element-content-newline": ["error", { ignores: [] }]
  }
}]);
