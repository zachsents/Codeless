module.exports = {
    parser: "@babel/eslint-parser",
    parserOptions: {
        sourceType: "module",
    },
    extends: [
        "eslint:recommended",
    ],
    env: {
        browser: true,
        amd: true,
        node: true,
        es6: true,
    },
    rules: {
        "no-extra-boolean-cast": 0,
    },
}