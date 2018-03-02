/**
 * Utils module
 * Write any (default) function
 */
const Utils = {

    /**
     * Serializes object and all its child properties
     * Example input: {a:1, b:2, c={d:1}
     * Example output: a=1&b=2&c[d]=1
     * urlEncode will encode all keys and values
     * skipPrefixIndex will remove the key from an array, like c[]=1 in above example
     *
     * @param {Object} obj - Object to serialize
     * @param {String} prefix - key prefix (example: formData). Usually not provided at first call
     * @param {boolean} urlEncode - flag to encode the parameters
     * @param {boolean} skipPrefixIndex - flag to skip the prefix index
     * @returns {string} serialized string
     */
    serialize: (obj, prefix, urlEncode, skipPrefixIndex) => {
        let str = [];

        for (let key in obj) {

            // check if there is a child object
            if (obj.hasOwnProperty(key)) {

                // check for prefix, for example formData. Result: formData[k]=v
                let serialisedKey = key,
                    value = obj[key],
                    serialisedPair;

                // if there is an prefix, it was an array deeper or child object.
                // In that case we want to set it as an array: x[]=y or x[x]=y
                if (prefix) {
                    if (skipPrefixIndex) {
                        serialisedKey = prefix + '[]';
                    } else {
                        serialisedKey = prefix + '[' + key + ']';
                    }
                }

                // call method recursively in case of an object, or append key=value to str arr
                if (typeof value === 'object') {
                    serialisedPair = Utils.serialize(value, serialisedKey, urlEncode, skipPrefixIndex)
                } else if (urlEncode) {
                    serialisedPair = encodeURIComponent(serialisedKey) + '=' + encodeURIComponent(value);
                } else {
                    serialisedPair = serialisedKey + '=' + value
                }

                str.push(serialisedPair);
            }
        }

        return str.join('&');
    },

    /**
     * Builds and appends query string to url
     *
     * @param {String} url - Url
     * @param {Object} obj - object to serialize
     * @param {boolean} urlEncode - flag to encode the parameters
     * @param {boolean} skipPrefixIndex - flag to skip the prefix index
     * @returns {string|*} Url with query string
     */
    buildQueryString: (url, obj, urlEncode, skipPrefixIndex) => {
        url += (!~url.indexOf('?') ? '?' : '&') + Utils.serialize(obj, null, urlEncode, skipPrefixIndex);

        return url;
    },

    /**
     * Replace a set of values in a string
     * Example: replaceString('ab', [a,b], [c,d]) returns 'cd'
     *
     * @param {String} str - String to find/replace values
     * @param {Array} find - Array with values to find
     * @param {Array} replace - Array with values to set
     * @returns {String} replaced string
     */
    replaceString: (str, find, replace) => {
        let replaceString = str;
        for (let i = 0; i < find.length; i++) {
            replaceString = replaceString.replace(find[i], replace[i]);
        }
        return replaceString;
    }
};

export default Utils;
