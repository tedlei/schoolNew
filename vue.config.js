// vue.config.js
const path = require('path')

module.exports = {
    // 选项...
    configureWebpack: {
        resolve: {
            // 自动解析确定的扩展名
            extensions: ['.vue', '.js'],
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                '@': path.resolve(__dirname, './src')
            }
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        chunks: "all",
                        test: /node_modules/,
                        name: "vendor",
                        minChunks: 1,
                        maxInitialRequests: 12,
                        minSize: 0,
                        priority: 100,
                    },
                    common: {
                        chunks: "all",
                        test: /[\\/]src[\\/]js[\\/]/,
                        name: "common",
                        minChunks: 2,
                        maxInitialRequests: 5,
                        minSize: 0,
                        priority: 60
                    },
                    styles: {
                        name: 'styles',
                        test: /\.(sa|sc|c)ss$/,
                        chunks: 'all',
                        enforce: true,
                    },
                    runtimeChunk: {
                        name: 'manifest'
                    }
                }
            }
        }
    }
}

