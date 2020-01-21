module.exports = {
    "plugins": {
        // to edit target browsers: use "browserslist" field in package.json
        "postcss-css-variables": {
            preserve: true,
            preserveInjectedVariables: false,
            variables: require("./css.json")
        }
    }
}
