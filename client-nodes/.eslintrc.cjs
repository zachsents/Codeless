module.exports = {
    root: true,
    extends: ["custom", "react"],
    env: {
        browser: true,
    },
    rules: {
        "react-hooks/exhaustive-deps": 0,
        "react/no-unescaped-entities": 0,
    },
    // settings: {
    //     react: {
    //         version: "detect",
    //     }
    // }
}