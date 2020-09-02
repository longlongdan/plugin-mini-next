var HTMLWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('mini-css-extract-plugin'); //css单独打包
const moment = require('moment');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var webpack = require('webpack');
const AutoDllPlugin = require('autodll-webpack-plugin');

var fs = require('fs');
function getPlugin(entryObj, isServer = false) {
    var dev = process.env.NODE_ENV !== 'production';
    var pages = Object.keys(entryObj);
    let webpackPlugin = [];
    pages.forEach(function(pathname) {
        var htmlName = entryObj[pathname];
        var entryName = pathname.split('/')[0];
        var template_local = htmlName
            .replace('.js', '.html')
            .replace('.mini-next', 'src/pages/' + entryName);
        var conf = {
            filename: entryName + '/' + entryName + '.html', //生成的html存放路径，相对于path
            template: template_local, //html模板路径
            title: entryName,
            inject: true, //js插入的位置，true/'head'/'body'/false
            hash: dev ? true : false, //为静态资源生成hash值
            favicon: 'src/favicon.ico', //favicon路径，通过webpack引入同时可以生成hash值
            chunks: [pathname], //需要引入的chunk，不配置就会引入所有页面的资源
            minify: {
                //压缩HTML文件
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: false //删除空白符与换行符
            }
        };
        var defineConf = Object.assign({}, conf, { template: 'src/template.html' });
        var exists = fs.existsSync(template_local);
        if (exists) {
            webpackPlugin.push(new HTMLWebpackPlugin(conf));
        } else {
            webpackPlugin.push(new HTMLWebpackPlugin(defineConf));
        }
        webpackPlugin.push(
            new AutoDllPlugin({
                inject: true,
                filename: '[name]_[hash].js',
                entry: {
                    dll_react: ['react'],
                    dll_react_dom: ['react-dom']
                }
            })
        );
    });
    !isServer &&
        webpackPlugin.push(
            new OpenBrowserPlugin({
                url: 'http://localhost:8080'
            })
        );
    // !isServer && webpackPlugin.push(new webpack.HotModuleReplacementPlugin()),
    webpackPlugin.push(
        new ExtractTextPlugin({
            filename: dev ? '[name].css' : `[name].css?v=${moment().format('YYYYMMDDHHmmss')}`
        })
    );
    webpackPlugin.push(
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(dev ? 'development' : 'production')
            }
        })
    );
    return webpackPlugin;
}
module.exports = {
    getPlugin
};
