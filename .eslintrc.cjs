module.exports = {
    parser: "@babel/eslint-parser",
    extends: [
        "eslint:recommended",
    ],
    rules: {
        "no-extra-boolean-cast": 0,
    },
    env: {
        browser: true,
        amd: true,
        node: true,
        es6: true,
    },
}