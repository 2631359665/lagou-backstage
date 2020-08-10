const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    // 开发模式: deveplopment，不会对代码压缩优化，方便调式
    // 生产模式：production,代码压缩，优化
    // 如果不配置会有警告信息
    mode: "development",

    // 代码调试，可以看到源代码
    devtool: "inline-cheap-source-map",
    // 入口文件,(不写默认按照package.json下的main配置项)
    entry: {
        // 默认带有隐形属性main
        "main": "./src/js/index.js"
    },
    // webpack-dev-server 启动时，不做打包服务
    output: {
        // 打包完成，输出文件位置（不能写相对路径）,(不写默认输出到dist/mian.js)
        path: path.resolve(__dirname, "./dev"),
        // hash 动态改变(安装html-webpack-plugin插件)
        filename: "[name]-[hash].js"
    },
    // 来自webpack-dev-server,配置devServer能做一些其它服务
    devServer: {
        // 允许公网访问本地
        disableHostCheck: true,
        // 使用g-zip压缩代码
        compress: true,
        port: 9099,
        open: true,
        // 配置代理，解决跨域问题
        proxy: {
            '/api': 'http://localhost:3000',
            "/upload": "http://localhost:3000"
        }
    },
    plugins: [
        new htmlWebpackPlugin({
            title: "webpack-demo-home",
            // 指定模板路劲
            template: "./src/views/index.html",
            // 文件名字（自动存储在output配置的目录）
            filename: "index.html",
            // 和entry属性一一对应
            chunks: ["main"]
        }),
        new MiniCssExtractPlugin({
            // 单独提取样式的文件名,读取entry下的name属性,默认提取到output配置路径
            filename: "[name]-[hash].css",
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: "./src/static", to: "./static" } // 相对于output里面配置的path
            ]
        })
    ],
    module: {
        rules: [{
                test: /\.s[ac]ss$/i,
                // 执行顺序从右向左
                use: [
                    // 把样式添加到html上
                    // 'style-loader',
                    // 把css单独提取出一个文件
                    MiniCssExtractPlugin.loader,
                    // 把css文件转换成commonJs风格
                    'css-loader',
                    // 把sass文件转换成css文件
                    'sass-loader',
                ]
            },
            {
                test: /\.html$/,
                use: "string-loader",
            }
        ]
    }
}

/* 改了配置文件需要重启，html，js改动自动刷新，不需要重启 */