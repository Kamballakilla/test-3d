const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: "./src/script.js",

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: "> 0.25%, not dead",
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.(glb|gltf)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "models/",
              name: "[name].[ext]",
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[hash][ext]',
        },
      },
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        type: 'asset/source',
        generator: {
          filename: 'assets/shaders/[hash][ext]',
        },
      }
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],

  devServer: {
    static: {
      directory: path.join(__dirname, "dist"), 
    },
    open: true, 
    hot: true, 
  },

  mode: "development", 
  devtool: "eval-source-map",
};
