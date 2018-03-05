module.exports = {
    plugins: [
        // import allows using import statement inside scss
        // precss allows sass-like syntax (vars, mixins, nesting, etc. not sure what it supports and how useful this is)
        require('precss'),
        // autoprefixer ensures browser prefixes are added automatically
        require('autoprefixer'),
        // minify css and remove comments
        require('cssnano')
    ]
};
