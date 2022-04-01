const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const buildPath = path.resolve(__dirname, "dist");

module.exports = {

    mode: "production",
    // This option controls if and how source maps are generated.
    // https://webpack.js.org/configuration/devtool/
    devtool: "source-map",

    // https://webpack.js.org/concepts/entry-points/#multi-page-application
    entry: {
        index: "./frontend/index.js",
        home: "./frontend/src/scripts/home.js",
    },

    // how to write the compiled files to disk
    // https://webpack.js.org/concepts/output/
    output: {
        filename: "[name].[hash:20].js",
        path: buildPath
    },

    // https://webpack.js.org/concepts/loaders/
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ]
            }
        ]
    },

    // https://webpack.js.org/concepts/plugins/
    plugins: [
        new HtmlWebpackPlugin({
            template: "./frontend/index.html",
            inject: "body",
            chunks: ["index"],
            filename: "index.html"
        }),
        new HtmlWebpackPlugin({
            template: "./frontend/home.html",
            inject: "body",
            chunks: ["home"],
            filename: "home.html"
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css",
            chunkFilename: "[id].[contenthash].css"
        })
    ],

    externals: ["ws"]
};