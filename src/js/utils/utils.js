import { h, cloneElement } from 'preact';

/**
 * Utils module
 * Write any (default) function
 */
const Utils = {

    /**
     * serialises object and all its child properties
     * Example input: {a:1, b:2, c={d:1}
     * Example output: a=1&b=2&c[d]=1
     * urlEncode will encode all keys and values
     * skipPrefixIndex will remove the key from an array, like c[]=1 in above example
     *
     * @param {Object} obj - Object to serialise
     * @param {string} prefix - key prefix (example: formData). Usually not provided at first call
     * @param {boolean} urlEncode - flag to encode the parameters
     * @param {boolean} skipPrefixIndex - flag to skip the prefix index
     * @returns {string} serialised string
     */
    serialise: (obj, prefix, urlEncode, skipPrefixIndex) => {
        let str = [];

        for (let key in obj) {

            // use hasOwnProperty so default object methods and properties (built-in JS) are skipped
            // https://stackoverflow.com/questions/684672/how-do-i-loop-through-or-enumerate-a-javascript-object
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

                if (value !== null) {

                    // call method recursively in case of an object, or append key=value to str arr
                    if (typeof value === 'object') {
                        serialisedPair = Utils.serialise(value, serialisedKey, urlEncode, skipPrefixIndex);
                    } else if (urlEncode) {
                        serialisedPair = encodeURIComponent(serialisedKey) + '=' + encodeURIComponent(value);
                    } else {
                        serialisedPair = serialisedKey + '=' + value;
                    }

                    str.push(serialisedPair);
                }
            }
        }

        return str.join('&');
    },

    /**
     * Builds and appends query string to url
     *
     * @param {string} url - Url
     * @param {Object} obj - object to serialise
     * @param {boolean} urlEncode - flag to encode the parameters
     * @param {boolean} skipPrefixIndex - flag to skip the prefix index
     * @returns {string|*} Url with query string
     */
    buildQueryString: (url, obj, urlEncode, skipPrefixIndex) => {

        // reset build url and return null if there are unreplaced identifiers
        // ~ shifts the bits like: -(i + 1) (invert plus 1). Makes it superfluous to check on -1 or >= 0
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Bitwise_NOT
        url += (!~url.indexOf('?') ? '?' : '&') + Utils.serialise(obj, null, urlEncode, skipPrefixIndex);

        return url;
    },

    /**
     * Replace a set of values in a string
     * Example: replaceString('ab', [a,b], [c,d]) returns 'cd'
     *
     * @param {string} str - String to find/replace values
     * @param {Array} find - Array with values to find
     * @param {Array} replace - Array with values to set
     * @returns {string} replaced string
     */
    replaceString: (str, find, replace) => {
        let replaceString = str;

        for (let i = 0; i < find.length; i++) {
            replaceString = replaceString.replace(find[i], replace[i]);
        }
        return replaceString;
    },

    /**
     * Removes the given keys in exclude from the given source
     * @param {Object} exclude - array of keys to exclude
     * @param {Object} source - source object
     * @returns {Object} object
     */
    excludeProps(exclude, source) {
        const result = {};

        if (source) {
            for (const key in source) {
                if (source.hasOwnProperty(key)) {
                    if (exclude.indexOf(key) === -1) {
                        result[key] = source[key];
                    }
                }
            }
        }

        return result;
    },

    /**
     * Checks whether the given parameters is an array
     * @param {*} object - object
     * @returns {boolean} is array
     */
    isArray(object) {
        const nativeIsArray = Array.isArray;
        const toString = Object.prototype.toString;

        return nativeIsArray(object) || toString.call(object) === '[object Array]';
    },

    /**
     * Create a root element for multiple children to be rendered or clone a component.
     * This can be used for either rendering a set of child elements at once, or when the component to be rendered
     * is called dynamically.
     *
     * @example
     * // below JSX example will have object[0] as a string "hello"
     * // this will return: <div class="hi">Hello</div>, as we will always need one root element
     * <Authenticated className="hi">
     *     hello
     * </Authenticated>
     *
     * @example
     * // below JSX example will have object[0] as a string "hello" and object[1] as a (p)react element
     * // this will return: <div>Hello <RenderedUserName/></div>, as we will always need one root element
     * <Authenticated>
     *     hello
     *     <UserName />
     * </Authenticated>
     *
     * @example
     * // below example will render an element from a string: <div key="hi">hello</div>
     * createRootElement("hello", {key:"hi"});
     *
     * @example
     * // below example will render a react component directly with the given props
     * createRootElement(Component, props);
     *
     * @param {string|array|Object} object - object(s) to be rendered
     * @param {Object} props - properties for the root element
     * @returns {Object} react or html element
     */
    createRootElement(object, props) {
        let newObject;

        // usually object is an array of elements
        if (typeof object === 'string' || this.isArray(object)) {
            if (!props) {
                props = {};
            }

            // render the given elements inside a div, as we can only return one root element
            // otherwise it would not be possible to render multiple given elements
            newObject = <div {...props}>{ object }</div>;
        } else {
            const newProps = props;
            let newChildren = [];

            if (object.props) {

                // we are dealing with a component
                // prepare the properties and children (separate them) for cloneElement
                for (const key in object.props) {
                    if (object.props.hasOwnProperty(key)) {
                        const value = object.props[key];

                        if (key === 'children') {
                            newChildren = value;
                        } else {
                            newProps[key] = value;
                        }
                    }
                }
            }

            // clone/render the given component
            newObject = cloneElement(object, newProps, newChildren);
        }

        return newObject;
    },

    /**
     * Returns a Date object of today in format YYYY-mm-dd hh:mm:ss
     * @returns {Date} today
     */
    getTodayDate() {
        const today = new Date();

        return new Date(`${today.getFullYear()}-${(today.getMonth() + 1)}-${today.getDate()} 00:00:00`);
    },

    /**
     * Formats the given date with the given format
     * Supported types: yyyy, yy, MM, dd, HH, hh, mm, ss
     * @param {Date|string} date - date to format
     * @param {string} format - format string
     * @returns {string|null} formatted date string
     */
    formatDate(date, format) {

        // dont proceed without a given format
        if (!format) {
            return null;
        }

        // create date object when a string was given
        if (typeof date === 'string') {
            date = new Date(date);
        }

        // extract date values from the given date
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const day = date.getDate();

        // parse month
        if (~format.indexOf('MM')) {
            format = format.replace('MM', this.padLeft(month.toString(), 2, '0'));
        }

        // parse year
        if (~format.indexOf('yyyy')) {
            format = format.replace('yyyy', year.toString());
        } else if (~format.indexOf('yy')) {
            format = format.replace('yy', year.toString().slice(2, 2));
        }

        // parse day
        if (~format.indexOf('dd')) {
            format = format.replace('dd', this.padLeft(day.toString(), 2, '0'));
        }

        // extract time values
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        // format hours
        if (~format.indexOf('HH')) {
            format = format.replace('HH', this.padLeft(hours.toString(), 2, '0'));
        } else if (~format.indexOf('hh')) {

            // subtract 12 when its past 12, or set to 12 when its 0 (pm time)
            if (hours > 12) {
                hours -= 12;
            } else if (hours === 0) {
                hours = 12;
            }

            format = format.replace('hh', this.padLeft(hours.toString(), 2, '0'));
        }

        // format minutes
        if (~format.indexOf('mm')) {
            format = format.replace('mm', this.padLeft(minutes.toString(), 2, '0'));
        }

        // format seconds
        if (~format.indexOf('ss')) {
            format = format.replace('ss', this.padLeft(seconds.toString(), 2, '0'));
        }

        return format;
    },

    /**
     * Repeats the given padding for the given amount of times
     * @param {string} char - padding character
     * @param {number} count - amount of times to pad
     * @returns {string} padded string
     */
    repeatPad(char, count) {
        let str = '';

        // add char for x (count) times
        for (let x = 0; x < count; x++) {
            str += char;
        }

        return str;
    },

    /**
     * Pads the given string on the left side
     * @param {string} str - string to pad
     * @param {number} width - width of what the string should be
     * @param {string} pad - padding character(s)
     * @returns {string} padded string
     */
    padLeft(str, width, pad) {
        if (!width || width < 1) {
            return str;
        }

        if (!pad) {
            pad = ' ';
        }

        // calculate the length what should still be padded
        const length = width - str.length;

        // return exact width when the string was already too long
        if (length < 1) {
            return str.slice(0, width);
        }

        // repeat the padding for x times and return string with exact width
        return (this.repeatPad(pad, length) + str).slice(0, width);
    }
};

export default Utils;
