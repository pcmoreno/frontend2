
let sourceMapsEnabled = false;
let gzippedAssets = false;

/* define plugins *****************************************************************************************************/

// this is used to minify / uglify processed JS
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

// this is used to extract the css imports from the JS components
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// this is used to clean out the assets folder everytime a new build is started
const CleanWebpackPlugin = require('clean-webpack-plugin');
let cleanOptions = {
    exclude: [],
    verbose: false
};

// this allows GZipping assets (JS, CSS), requires server config: https://varvy.com/pagespeed/enable-compression.html
const CompressionPlugin = require('compression-webpack-plugin');

// this allows the use of relative paths (see below)
const path = require('path');
const paths = {
    DIST: path.resolve(__dirname, './web'),
    GLOBAL_CSS: path.resolve(__dirname, './src/style')
};

// this is used to copy static assets over to the web folder
const CopyWebpackPlugin = require('copy-webpack-plugin');

// this is used to interact with webpack
const webpack = require('webpack');

/* configure webpack **************************************************************************************************/

// configure the 'task' for Webpack to run by default (Webpack) or, if configured, when using NPM script: Yarn run build
module.exports = {
    entry: {
        // each entry point defined here is scanned for imported files, that are matched against rules defined below
        app: './src/js/App.js',
        common: './src/js/utils/common.js'
    },
    output: {
        // here you configure where (and how) the bundled files will be stored
        path: paths.DIST,
        filename: 'js/[name].js',
        sourceMapFilename: '[file].map',
        chunkFilename: './../web/js/[name].js'
    },
    devtool: sourceMapsEnabled ? 'cheap-module-eval-source-map' : false,
    module: {
        // define rules for each imported file. if an imported file does not match a rule, webpack will error
        rules: [
            {
                // process every imported .js file (starting from entry point) and transpile to presets defined below
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: ['env']
                }
            },
            {
                // process all SCSS/SASS/CSS file imported in the JS extracted by the above rule, excluding common.scss
                test:  /\.scss$|\.sass$|\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            // process the extracted SCSS as ordinary CSS (should be first in list of loaders)
                            loader: "css-loader",
                            options: {
                                // will move any encountered @import statements to the top of the generated css
                                importLoaders: 1,
                                // enables css modules where css is automatically tied to a js component by name
                                modules: true,
                                // define source maps
                                sourceMap: sourceMapsEnabled
                            }
                        },
                        {
                            // process resulting css with PostCSS and its modules as configured in postcss.config.js
                            loader: 'postcss-loader'
                        }
                    ]
                }),
                // do not parse imports found here (you have to use paths to specify a path)
                exclude: paths.GLOBAL_CSS
            },
            {
                // since all common.scss imports were excluded by the previous css test, they will be handled here
                test:  /\.scss$|\.sass$|\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            // process the extracted SCSS as ordinary CSS (should be first in list of loaders)
                            loader: "css-loader",
                            options: {
                                // will move any encountered @import statements to the top of the generated css
                                importLoaders: 1,
                                // disable css modules (otherwise this css cannot be global)
                                modules: false,
                                // define source maps
                                sourceMap: sourceMapsEnabled
                            }
                        },
                        {
                            // process resulting css with PostCSS and its modules as configured in postcss.config.js
                            loader: 'postcss-loader'
                        }
                    ]
                }),
                // only parse imports found here (you have to use paths to specify a path)
                include: paths.GLOBAL_CSS
            }
        ]
    },
    plugins: [
        // configure plugins used by webpack
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV /* || 'development' */)
            }
        }),
        new CleanWebpackPlugin(['web/assets', 'web/js','web/css'], cleanOptions),
        new UglifyJSPlugin({
            uglifyOptions: {
                sourceMap: sourceMapsEnabled,
                parallel: true,
                compress: {
                    ecma: 5,
                    ie8: true,
                    warnings: true
                },
                mangle: false,
                output: {
                    comments: false
                }
            }
        }),
        new ExtractTextPlugin("css/[name].css"),
        new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: gzippedAssets ? 1 : 100000000,
            minRatio: .9,
            deleteOriginalAssets: false
        }),
        new CopyWebpackPlugin([
            { from: './src/assets', to: './assets' }
        ])
    ],
    resolve: {
        // to be able to import or require 'file' instead of 'file.js'
        extensions: ['.js', '.scss', '.sass', '.css'],
        // when using Preact, this adds some aliases so external dependencies will continue to work
        alias: {
            'react': 'preact-compat',
            'react-dom': 'preact-compat'
        }
    }
};





