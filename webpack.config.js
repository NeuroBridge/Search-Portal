const path = require('path')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const DotenvPlugin = require('dotenv-webpack')
const ESLintPlugin = require('eslint-webpack-plugin')

let mode = 'development'
let target = 'web'
const plugins = [
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin(),
  new HtmlWebpackPlugin({
    template: './src/index.html',
    favicon: './src/images/favicon.png',
  }),
  // new DotenvPlugin({
  //   path: './.env', // Path to .env file (this is the default)
  //   safe: true, // load .env.example (defaults to "false" which does not use dotenv-safe)
  // }),
  new ESLintPlugin({
    extensions: ['./src', 'js'],
  }),
]

if (process.env.NODE_ENV === 'production') {
  mode = 'production'
}
if (process.env.SERVE) {
  plugins.push(new ReactRefreshWebpackPlugin())
}

module.exports = {
  mode: mode,

  target: target,

  entry: './src/index.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'images/[hash][ext][query]',
  },

  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        // type:
        //   "asset/inline": base-64 inline images in js bundle
        //   "asset/resource": images will be imported as separate resources
        //   "asset": webpack will determine, based on file size, whether it
        //            should base-64 inline the images or import them as assets.
        //            8kb is the default cutoff, which can be changed.
        type: 'asset',
      },
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [ // these load rtl
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'postcss-loader',
        ]
      },
      {
        test: /\.jsx?$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.owl/i,
        use: {
          loader: 'xml-loader',
        },
      },
      {
        test: /\.ya?ml$/,
        use: 'yaml-loader',
      }
    ]
  },

  plugins: plugins,

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  devtool: 'source-map',

  devServer: {
    hot: true,
    historyApiFallback: true,
    static: path.resolve(__dirname, 'dist'),
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined')
      }
      console.log()
      console.log(` _|_|_|    _|_|_|_|  _|      _|    _|_|_|  _|_|_| `)
      console.log(` _|    _|  _|        _|_|    _|  _|          _|   `)
      console.log(` _|_|_|    _|_|_|    _|  _|  _|  _|          _|   `)
      console.log(` _|    _|  _|        _|    _|_|  _|          _|   `)
      console.log(` _|    _|  _|_|_|_|  _|      _|    _|_|_|  _|_|_| `)
      console.log(`\n`)
      return middlewares
    },
  },

}
