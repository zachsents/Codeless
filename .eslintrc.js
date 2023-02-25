module.exports = {
    parser: "@babel/eslint-parser",
    parserOptions: {
        sourceType: "module",
        babelOptions: {
            "presets": ["@babel/preset-react"]
        },
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
    ],
    env: {
        browser: true,
        amd: true,
        node: true,
        es6: true,
    },
    rules: {
        "no-extra-boolean-cast": 0,
        "no-sparse-arrays": 0,
        "react/react-in-jsx-scope": 0,
        "react/prop-types": 0,
    },
    overrides: [
        {
            files: [
                "**/*.test.js"
            ],
            env: {
                jest: true,
            },
        }
    ],
}