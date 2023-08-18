import path from "path";
import * as dotenv from "dotenv";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";
import Dotenv from "dotenv-webpack";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const outputDirectory = "dist";
export default {
  entry: ["babel-polyfill", "./src/client/index.js"],
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: "url-loader",
        options: {
          limit: 100000,
        },
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
    fallback: {
      async_hooks: false,
      fs: false,
      net: false
    }
  },
  devServer: {
    port: 3000,
    open: true,
    historyApiFallback: true,
    proxy: {
      "/api/*": `http://localhost:${process.env.PORT}`,
    },
  },
  plugins: [
    new NodePolyfillPlugin(),
    new CleanWebpackPlugin({ cleanAfterEveryBuildPatterns: [outputDirectory] }),
    new Dotenv(),
    new HtmlWebpackPlugin.default({
      template: "./public/index.html",
      favicon: "./public/favicon.ico",
    }),
  ]
};
