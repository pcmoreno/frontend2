
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
    GLOBAL_CSS: path.resolve(__dirname, './src/style')
};

// this is used to copy static assets over to the web folder
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
        // define rules for each encountered file at entry points (if a file does not match a rule, webpack will error)
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
                // 2. process all global css (./style/**/*.scss) and EXCLUDE css imported by the JS modules (rule #1)
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
                            // process resulting css with PostCSS (and its modules as configured in postcss.config.js)
                            loader: 'postcss-loader'
                        }
                    ]
                }),
                // as said, only INCLUDE imports found here (you have to use 'paths' to specify a path in webpack)
                include: paths.GLOBAL_CSS
            },
            {
                // 3. process all remaining SCSS/SASS/CSS files imported by extracted JS components from rule #1
                // todo: the css imported here has no knowledge of css imported by step 2. thus it has no variables.
                // todo: and no, removing the EXCLUDE below wont help. only option I see is to manually import the
                // todo: css generated at step 2 into each css file requiring the variables. that is UGLY and not DRY.
                // todo: before you ask, the reason to split css between step 2 and 3 has to do with css modules: we
                // todo: dont want our common, global css to be css-module'd since it wont be global or usable anymore.
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
                                // enables css modules (will result in specific css per component, no more conflicts!)
                                modules: true,
                                // define source maps
                                sourceMap: sourceMapsEnabled
                            }
                        },
                        {
                            // process resulting css with PostCSS (and its modules as configured in postcss.config.js)
                            loader: 'postcss-loader'
                        }
                    ]
                }),
                // EXCLUDE the global css (it was handled by rule #2 already)
                exclude: paths.GLOBAL_CSS
            }
        ]
    },
    plugins: [
        // configure plugins used by webpack
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
            { from: './src/assets', to: './assets' },
        ]),
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
