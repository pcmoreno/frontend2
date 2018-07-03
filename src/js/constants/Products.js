/**
 * These properties must all have a PRODUCT_ prefix as these keys will be mangled upon making an obfuscated build.
 * See webpack.config.js UglifyJS regex
 */
const Products = {
    PRODUCT_DEVELOPMENT: '2a5e45ab-7912-4ff7-81f0-89ca574b6a27',
    PRODUCT_SELECTION: 'bab11893-045b-4c26-9cc5-586d879ae4ac',
    PRODUCT_SELECTION_DEVELOPMENT: 'fd47afed-9ee0-4f7a-9bab-9e5504b5c5aa',
    PRODUCT_PERSONA_FIT_2: '421c0414-ca05-4e05-95a7-f9f8f23b28ee'
};

export default Products;
