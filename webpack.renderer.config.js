'use strict'

process.env.BABEL_ENV = 'renderer'

const fs = require('fs')
const path = require('path')
const pkg = require('./app/package.json')
const settings = require('./config.js')
const webpack = require('webpack')

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

let files = fs.readdirSync(path.join(__dirname, 'app/src/renderer')).filter(item => !/@/.test(item))
let entry = {}
let htmlPlugins = []
files.forEach(item => {
  entry[item] = path.join(__dirname, `app/src/renderer/${item}/main.js`)
  htmlPlugins.push(new HtmlWebpackPlugin({
    filename: `${item}.html`,
    template: `./app/src/renderer/${item}/index.ejs`,
    chunks: [`${item}`],
    appModules: process.env.NODE_ENV !== 'production'
      ? path.resolve(__dirname, 'app/node_modules')
      : false
  }))
})

let rendererConfig = {
  devtool: '#eval-source-map',
  devServer: { overlay: true },
  entry: entry,
  externals: Object.keys(pkg.dependencies || {}),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.html$/,
        use: 'vue-html-loader'
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      },
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            loaders: {
              sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax=1',
              scss: 'vue-style-loader!css-loader!sass-loader'
            }
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'imgs/[name].[ext]'
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'fonts/[name].[ext]'
          }
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    // multi
    ...htmlPlugins,
    new webpack.NoEmitOnErrorsPlugin()
  ],
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    chunkFilename: '[name].chunk.js',
    path: path.join(__dirname, 'app/dist')
  },
  resolve: {
    alias: {
      '@components': path.join(__dirname, 'app/src/renderer/@components'),
      '@renderer': path.join(__dirname, 'app/src/renderer'),
      '@pages': path.join(__dirname, 'app/src/renderer/@pages'),
      '@main': path.join(__dirname, 'app/src/main'),
      '@src': path.join(__dirname, 'app/src'),
      '@tools': path.join(__dirname, 'app/src/tools')
    },
    extensions: ['.js', '.vue', '.json', '.css', '.node'],
    modules: [
      path.join(__dirname, 'app/node_modules'),
      path.join(__dirname, 'node_modules')
    ]
  },
  target: 'electron-renderer'
}

if (process.env.NODE_ENV !== 'production') {
  /**
   * Apply ESLint
   */
  if (settings.eslint) {
    rendererConfig.module.rules.push(
      {
        test: /\.(js|vue)$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
          options: {
            formatter: require('eslint-friendly-formatter')
          }
        }
      }
    )
  }
}

/**
 * Adjust rendererConfig for production settings
 */
if (process.env.NODE_ENV === 'production') {
  rendererConfig.devtool = ''

  rendererConfig.plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
  )
}

module.exports = rendererConfig
