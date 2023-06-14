
module.exports = {
    root: true,
    extends: ["custom", "plugin:react/recommended"],
    env: {
        browser: true,
    },
    rules: {
        "react-hooks/exhaustive-deps": 0,
        "react/no-unescaped-entities": 0,
    },
    plugins: ["react"],
    settings: {
        react: {
            version: "detect",
        }
    },
}