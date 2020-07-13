const path = require('path');
var assets = path.resolve(__dirname, 'src/assets');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = { 
    entry: __dirname + "/src/js/main.js",
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
      },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
            test: /\.html$/,
            use: [
                {
                    loader: "html-loader",
                    options: { minimize: true }
                }
            ]
        },
        {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, "css-loader"]
        },
        {
          //Image Loader code need to refactor
            test: /\.(png|jpg)$/,
            use: [{
              loader: 'url-loader',
              options: {
                limit: 10000,
                name: './src/images/[name].[ext]',
                publicPath: './img/'
              }
            }]            
        },
        {
          //assets file Loader code need to refactor
            test: /\.(ogg|mp3|wav|mpe?g)$/i,
            loader: 'file-loader',
            include: assets,           
        }
      ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ]
  }