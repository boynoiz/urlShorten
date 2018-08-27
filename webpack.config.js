const path = require("path");
const fg = require('fast-glob');
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurgecssPlugin = require("purgecss-webpack-plugin");

module.exports = (env, argv) => ({
  entry: path.join(__dirname, "views", "app.js"),
  mode: argv.mode,
  output: {
    path: __dirname + "/public/assets",
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].bundle.js'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: "styles",
          test: /\.css$/,
          chunks: "all",
          minChunks: 1,
          reuseExistingChunk: true,
          enforce: true
        }
      }
    },
    minimizer:
      argv.mode === "production"
        ? [
            new OptimizeCSSAssetsPlugin(),
            new UglifyJsPlugin({
              cache: true,
              parallel: true,
              sourceMap: false,
              uglifyOptions: {
                ie8: false,
                ecma: 6,
                parse: {},
                mangle: {},
                output: {
                  comments: false,
                  beautify: false
                },
                compress: {
                  drop_console: true,
                  ecma: 6
                },
                warnings: false
              }
            })
          ]
        : []
  },
  devtool:
    argv.mode === "development" ? "cheap-module-eval-source-map" : undefined,
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        include: [path.join(__dirname, "views")]
      },
      {
        test: /\.css$/,
        use: [
          //This plugin should be used only on production builds without style-loader in the loaders chain
          argv.mode === "production"
            ? MiniCssExtractPlugin.loader
            : "style-loader",
          "css-loader"
        ]
      }
    ]
  },
  plugins: [
    new Dotenv(),
    new VueLoaderPlugin(),
    new PurgecssPlugin({
      paths: fg.sync([
        path.join(__dirname, "views/**/*.html"),
        path.join(__dirname, "views/**/*.vue"),
        path.join(__dirname, 'node_modules/bootstrap-vue/src/**/*.js'),
      ]).filter(function (f) { return !/\/$/.test(f) }),
      whitelist: ['html', 'body']
    }),
    new MiniCssExtractPlugin({
      filename:
        argv.mode === "development" ? "[name].css" : "[name].[contenthash].css",
      chunkFilename:
        argv.mode === "development"
          ? "[id].css"
          : "[name].[id].[contenthash].css"
    }),
    new HtmlWebpackPlugin({
      filename: path.join(__dirname, "public", "index.html"),
      template: path.join(__dirname, "views/template", "index.html"),
      inject: true,
      minify:
        argv.mode === "production"
          ? {
              removeComments: true,
              collapseWhitespace: true,
              removeAttributeQuotes: true
              // More options:
              // https://github.com/kangax/html-minifier#options-quick-reference
            }
          : false
    })
  ],
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules/
  }
});
