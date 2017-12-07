const babelJest = require('babel-jest');

// Get the babelConfig
const preactCLIBabelRC = require('preact-cli/lib/lib/babel-config.js');

const transformer = () => {
    // It is important so set the modules options otherwise it is 'false' and Jest can't use babel to transpile
    let babelConfig = preactCLIBabelRC.default('test', { modules: 'commonjs' } );
    return babelJest.createTransformer(babelConfig);
};

module.exports = transformer();
