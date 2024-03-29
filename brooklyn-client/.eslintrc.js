module.exports = {
  extends: ["prettier/react", "plugin:react/recommended"],
  plugins: ["prettier"],
  parser: "babel-eslint",
  rules: {
    "prettier/prettier": "error",
    "no-unused-vars": [
      "error",
      { vars: "all", args: "after-used", ignoreRestSiblings: false }
    ],
    "react/prop-types": "off",
    "react/no-string-refs": "warn",
    "react/no-find-dom-node": "warn"
  },
  settings: {
    react: {
      pragma: "React",
      version: "detect",
      flowVersion: "0.53"
    }
  }
};
