
module.exports = {
    root: true,
    extends: ["custom", "plugin:react/recommended"],
    env: {
        browser: true,
    },
    rules: {
        "react-hooks/exhaustive-deps": 0,
        "react/no-unescaped-entities": 0,
        "react/react-in-jsx-scope": 0,
        "react/prop-types": 0,
    },
    plugins: ["react"],
    settings: {
        react: {
            version: "detect",
        }
    },
}