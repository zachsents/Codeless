module.exports = {
    root: true,
    // This tells ESLint to load the config from the package `eslint-config-custom`
    extends: ["custom"],
    settings: {
        next: {
            rootDir: ["web/"],
        },
    },
    // extends: [
    //     "eslint:recommended",
    //     "plugin:react/recommended",
    // ],

    // settings: {
    //     react: {
    //         version: "detect",
    //     }
    // }
}