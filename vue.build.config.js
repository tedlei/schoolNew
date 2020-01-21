import merge from 'webpack-merge'
import config  from './vue.config'

// const CompressionWebpackPlugin = require('compression-webpack-plugin');

module.exports = merge({
    configureWebapck: {
        devtool: "cheap-module-eval-source-map",
        // plugins: [
        //     new CompressionWebpackPlugin({
        //         filename: '[path].gz[query]',
        //         algorithm: 'gzip',
        //         test: /\.js$|\.json$|\.css/,
        //         threshold: 0, // 只有大小大于该值的资源会被处理
        //         minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
        //         deleteOriginalAssets: true // 删除原文件
        //     })
        // ]
    },
    publicPath: './'
}, config)
