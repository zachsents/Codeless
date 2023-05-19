module.exports = {
    extends: ["eslint:recommended", "prettier"],
    parserOptions: {
        sourceType: "module",
        ecmaVersion: "2022",
    },
    rules: {
        // "no-extra-boolean-cast": 0,
        // "no-sparse-arrays": 0,
        // "react/react-in-jsx-scope": 0,
        // "react/prop-types": 0,
    },
    env: {
        es2020: true,
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