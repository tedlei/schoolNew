import merge from 'webpack-merge'
import config  from './vue.config'

module.exports = merge({
    configureWebapck: {
        devServer: {
            overlay: {
                warnings: false,
                errors: true
            },
            port: 9000,
            // lintOnSave: false
        },
        devtool: "none"
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
    publicPath: '/'
}, config)
