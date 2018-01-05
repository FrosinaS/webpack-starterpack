const path = require('path');
let webpack = require('webpack');
let ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
let WebpackCleanupPlugin = require('webpack-cleanup-plugin');

let uglifyJsConfig = new webpack.optimize.UglifyJsPlugin({
    compress: {warnings: false}
}); //to minify js

let hotModuleReplacement = new webpack.HotModuleReplacementPlugin(); //for refreshing modules when changes are made

let webpackCleanup = new WebpackCleanupPlugin({
    exclude: ['images/*']
}); //to remove unnecessary js and json files when changes are made

let ExtractTextPlugin = new ExtractTextWebpackPlugin({
    filename: 'bundle.css',
    allChunks: true,
    disable: false
}); //for creating separate file for styles

module.exports = {
    context: __dirname,
    entry: [
        path.join(__dirname, '/public/src/js/main.js'), // path to main javascript file
        path.join(__dirname, '/public/sass/main.scss'), // path to main SASS file
        path.join(__dirname, '/public/index.html') // path to main html file to track html changes also
    ],
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, '/public/dist') // where to put js code
    },
    watch: true, //to watch for changes and recompile
    plugins: [
        hotModuleReplacement,
        uglifyJsConfig,
        webpackCleanup,
        ExtractTextPlugin
    ],
    module: {
        rules: [
            {
                //for converting ES6 to ES5
                test: /\.js/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['@babel/preset-env']
                }
            },
            {
                //for converting SASS to plain CSS
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                //for reading css as style and putting it into <style></style> tag
                test: '/\.css/',
                loaders: [
                    'style',
                    'css?importLoaders=1',
                ]
            },
            {
                //for reading images as files
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    'file-loader?name=images/[hash].[ext]',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            bypassOnDebug: true,
                        },
                    },
                ],
            },
            {
                //for reading fonts properly
                test: /\.(woff|woff2|eot|ttf)$/,
                loader: 'url-loader'
            },
            {
                test: /\.html$/,
                use: [ {
                    loader: 'html-loader',
                }],
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.es6', '.scss', '.sass', '.css'], //available extensions
        alias: {
            vue: 'vue/dist/vue.common.js'
        }
    },
};

return module;