const path = require("path");

module.exports = () => {
    return {
        context: path.join(__dirname, "./src"),
        entry: "./stylish-formatter/stylish-formatter.ts",
        output: {
            path: __dirname,
            filename: "stylishFormatter.js",
            library: "tslintStylishFormatter",
            libraryTarget: "umd"
        },
        module: {
            rules: [{
                test: /\.ts$/,
                loader: "awesome-typescript-loader"
            }]
        },
        resolve: {
            extensions: [".ts", ".js"],
            modules: ["./node_modules"]
        }
    }
};