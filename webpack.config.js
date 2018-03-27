
// todo: figure out how sourcemaps can be enabled by default for dev and acc environments
let sourceMapsEnabled = false;
let gzippedAssets = false;

/* define plugins *****************************************************************************************************/

// this is used to minify / uglify processed JS
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

// this is used to extract the css imports from the JS components
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// this is used to clean out the assets folder every time a new build is started
const CleanWebpackPlugin = require('clean-webpack-plugin');
let cleanOptions = {
    exclude: [],
    verbose: false
};

// this allows GZipping js & css assets, requires server config: https://varvy.com/pagespeed/enable-compression.html
const CompressionPlugin = require('compression-webpack-plugin');

// this allows the use of relative paths (see below)
const path = require('path');
const paths = {
    DIST: path.resolve(__dirname, './web'),
    GLOBAL_CSS: path.resolve(__dirname, './src/style/global.scss'),
    GLOBAL_VARIABLES: path.resolve(__dirname, './src/style/variables/index.scss')
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
                // 1. process every imported .js file (starting from entry point) and transpile to the defined presets
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: ['env']
                }
            },
            {
                // 2. process all CSS encountered at entry point, but ONLY include the global css found in ./src/style/
                test:  /\.scss$|\.sass$|\.css$/,
                loader: ExtractTextPlugin.extract({
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
                // as said, only INCLUDE imports found here (you have to use 'paths' to specify a path in webpack)
                include: paths.GLOBAL_CSS
            },
            {
                // 3. process all CSS encountered at entry point, but EXCLUDE the global css found in ./src/style/
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
                        },
                        {
                            // finally ensure the variables are loaded before transpiling the lot into a single .css
                            loader: 'sass-resources-loader',
                            options: {
                                // Provide path to the file with resources
                                resources: paths.GLOBAL_VARIABLES
                            }
                        }
                    ]
                }),
                // as said, EXCLUDE the global css (it was handled by rule #2 already)
                exclude: paths.GLOBAL_CSS
            }
        ]
    },
    plugins: [
        // configure plugins used by webpack
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
                NEON_API_BASE_URL: JSON.stringify(process.env.NEON_API_BASE_URL || 'http://dev.ltponline.com:8000/api/v1'),
                COGNITO_USER_POOL_ID: JSON.stringify(process.env.COGNITO_USER_POOL_ID || 'eu-central-1_eeBtQkabk'),
                COGNITO_APP_CLIENT_ID: JSON.stringify(process.env.COGNITO_APP_CLIENT_ID || '7i9ckoogpksm27r7llfagsgfgv')
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
