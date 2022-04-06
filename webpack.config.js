const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const buildPath = path.resolve(__dirname, "dist");

module.exports = {

    mode: "production",
    devtool: "source-map",

    entry: {
        bundle: "./frontend/entry.js"
    },

    output: {
        filename: "[name].js",
        path: buildPath
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ]
            },
            {
                test: /\.mp3$/,
                use: "file-loader"
            },
            {
                test: /\.wav$/,
                use: 'file-loader'
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./frontend/index.html",
            inject: "body",
            chunks: ["bundle"],
            filename: "index.html"
        }),
        new HtmlWebpackPlugin({
            template: "./frontend/home.html",
            inject: "body",
            chunks: ["bundle"],
            filename: "home.html"
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].[contenthash].css"
        })
    ],

    externals: ["ws"]
};