var path = require('path')
var webpack = require('webpack')
var utils = require('./utils.js')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin')
var nodeExternals = require('webpack-node-externals');
var HtmlwebpackPlugin = require('html-webpack-plugin');

var isProduction = process.env.NODE_ENV === 'product'

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}
var Version = new Date().getTime();
module.exports = {
    mode: "development",
    entry: ['./src/client/main.js'],
    output: {
        path: path.resolve(__dirname, './../www/dist/'),
        publicPath: '/dist/',
        filename: 'build.'+Version+'.js'
    },
    externals:[/config\/server/,/src\/server/], //过滤掉服务端的代码打入到bundle 
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src')
        }
    },
    node: {
        fs: "empty"
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader'                
            },
             {
                test: /\.js$/,
                exclude:[ /node_modules/],
                use: {
                    loader: 'babel-loader?optional=runtime&cacheDirectory=true',
                    options: {
                        presets: ['env'],
                        plugins: ['transform-runtime']
                    }
                }
            },
            {
                test: /\.(svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                // 图片加载器 
                test:/\.(png|jpg|gif|jpeg)$/,
                loader:'url-loader?limit=2048'
            },
            {
            test: /\.css$/,
            use: [
              'vue-style-loader',
              'css-loader'
              ]
           },
           {
             test: /\.scss$/,
             use: [
                      'vue-style-loader',
                      'css-loader',
                      'sass-loader'
                ]
            },
            { 
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true
    },
    performance: {
        hints: false
    },    
    plugins: [
    new VueLoaderPlugin(),
    new HtmlwebpackPlugin({     
      template:'./build/index.html',
      filename:'../index.html'
    })
    ]
}

if (process.env.NODE_ENV === 'development') {
  module.exports.devtool = '#eval-source-map'
}
