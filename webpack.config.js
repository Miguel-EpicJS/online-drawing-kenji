import path from "path"
import {fileURLToPath} from "url"
import HtmlWebpackPlugin from "html-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildPath = path.resolve(__dirname, "dist");

export default {

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
                    "css-loader",
                    "style-loader"
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
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].[contenthash].css"
        })
    ],

    externals: ["ws"]
};