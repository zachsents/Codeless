module.exports = {
    extends: ["next", "turbo", "prettier"],
    parserOptions: {
        babelOptions: {
            presets: [require.resolve("next/babel")],
        },
    },
    rules: {
        "@next/next/no-html-link-for-pages": "off",
        "no-extra-boolean-cast": 0,
        "no-sparse-arrays": 0,
        "react/react-in-jsx-scope": 0,
        "react/prop-types": 0,
        "react/no-unescaped-entities": 0,
        "react-hooks/exhaustive-deps": 0,
    },
    env: {
        browser: true,
        amd: true,
        node: true,
        es6: true,
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