module.exports = {
    plugins: [
        // import allows using import statement inside scss
        require('postcss-import'),
        // precss allows sass-like syntax (vars, mixins, nesting, etc)
        require('precss'),
        // autoprefixer ensures browser prefixes are added automatically
        require('autoprefixer'),
        // minify css and remove comments
        require('cssnano')
    ]
};
