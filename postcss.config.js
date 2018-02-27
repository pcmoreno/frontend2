module.exports = {
    plugins: [
        // precss allows sass-like syntax (vars, mixins, nesting, etc)
        require('precss'),
        // simple-vars allows using $sass-like-variables (todo: but it cant reach our global css, yet)
        require('postcss-simple-vars'),
        // autoprefixer ensures browser prefixes are added automatically
        require('autoprefixer'),
        // minify css and remove comments
        require('cssnano')
    ]
};
