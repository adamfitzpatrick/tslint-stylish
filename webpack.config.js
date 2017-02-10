const path = require("path");

module.exports = () => {
    return {
        context: path.join(__dirname, "./src"),
        entry: "./entry.ts",
        output: {
            path: path.join(__dirname, "./dist"),
            filename: "index.js",
            library: "tslintStylish",
            libraryTarget: "umd"
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: "awesome-typescript-loader"
                }
            ]
        },
        resolve: {
            extensions: [".ts", ".js"],
            modules: ["./node_modules"]
        }
    }
};