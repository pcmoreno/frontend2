import { h, cloneElement } from 'preact';
import Logger from './logger';

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
     * Compares the value of the given parameters
     * @param {*} value1 - value one to compare
     * @param {*} value2 - second value to compare
     * @returns {boolean} comparing result
     */
    compareData(value1, value2) {
        let comparison = false;

        try {
            const jsonValue1 = JSON.stringify(value1);
            const jsonValue2 = JSON.stringify(value2);

            // compare json stringified values
            comparison = (jsonValue1 === jsonValue2);
        } catch (e) {

            // return false by default
        }

        return comparison;
    },

    /**
     * Loads an external javascript source
     * @param {string} src - source path
     * @returns {Promise} promise
     */
    loadExternalScript(src) {
        return new Promise((onFulfilled, onRejected) => {
            const script = document.createElement('script');
            let loaded;

            // set source path to load
            script.setAttribute('src', src);

            // ready / loaded listeners
            script.onreadystatechange = script.onload = () => {
                if (!loaded) {
                    onFulfilled(script);
                }
                loaded = true;
            };

            // error listener
            script.onerror = function() {
                Logger.instance.error({
                    message: `Error loading external script: ${src}`
                });
                onRejected(new Error(`Error loading external script: ${src}`));
            };

            // append the given script
            document.getElementsByTagName('head')[0].appendChild(script);
        });
    },

    /**
     * Removes the reference to a script and deletes given globals
     * @param {string} scriptReference - reference to script element
     * @param {array} globalsToClear - array of strings or objects that should be cleared
     * @returns {undefined}
     */
    removeExternalScript(scriptReference, globalsToClear) {

        // remove head reference to the script
        if (scriptReference && scriptReference.parentNode) {
            scriptReference.parentNode.removeChild(scriptReference);
        }

        // remove any associated globals that were given
        if (globalsToClear && globalsToClear.length) {
            globalsToClear.forEach(global => {
                if (window[global]) {
                    window[global] = null;
                    delete window[global];
                }
            });
        }
    },

    /**
     * Reads the browser language and converts it to a usable language format (e.g. en_GB)
     * For error purposes, it will verify that it is in the list of the given supported languages
     * @param {array} supportedLanguages - supported languages (e.g. ['en_GB'])
     * @param {string} defaultLanguage - default language
     * @param {Object} [mappedLanguages] - mapped languages like {en: 'en_GB'}
     * @returns {string|boolean} language or false
     */
    getBrowserLanguage(supportedLanguages, defaultLanguage, mappedLanguages) {
        let browserLanguage = '';

        try {

            // try the default language
            browserLanguage = navigator.language;

            // in case a language is not set, take the first available one
            if (!browserLanguage && navigator.languages.length) {
                browserLanguage = navigator.languages[0];
            }

        } catch (e) {

            // continue, we have a default language fallback
        }

        // map the language to a usable language format, in case it wasn't
        if (mappedLanguages) {
            for (const key in mappedLanguages) {
                if (mappedLanguages.hasOwnProperty(key)) {

                    // we've given another format for this language (if its a match)
                    if (browserLanguage.toLowerCase() === key.toLowerCase()) {
                        browserLanguage = mappedLanguages[key];
                    }
                }
            }
        }

        // set to default if detected language was not in the list of valid languages
        if (!browserLanguage || !~supportedLanguages.indexOf(browserLanguage)) {
            browserLanguage = defaultLanguage;
        }

        return browserLanguage;
    },

    /**
     * Converts the participant language to a frontend usable language (e.g. nl-NL to nl_NL)
     * @param {string} participantLanguage - participant language
     * @returns {string} converted language
     */
    convertParticipantLanguage(participantLanguage) {
        return participantLanguage.trim().replace('-', '_');
    },

    /**
     * random Uuid generator for Javascript (RFC4122 compliant)
     * https://gist.github.com/jcxplorer/823878
     *
     * @returns {string} uuid
     */
    uuid() {
        let uuid = '',
            i,
            random;

        for (i = 0; i < 32; i++) {
            random = Math.random() * 16 | 0;

            if (i === 8 || i === 12 || i === 16 || i === 20) {
                uuid += '-';
            }
            uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16); // eslint-disable-line no-nested-ternary
        }
        return uuid;
    },

    /**
     * Converts the given string from camelcase to snake case
     * @param {string} str - camel case string
     * @returns {string} snake case string
     */
    camelCaseToSnakeCase(str) {
        const upperChars = str.match(/([A-Z])/g);

        if (!upperChars) {
            return str;
        }

        for (let i = 0, n = upperChars.length; i < n; i++) {
            str = str.replace(new RegExp(upperChars[i]), `_${upperChars[i].toLowerCase()}`);
        }

        if (str.slice(0, 1) === '_') {
            str = str.slice(1);
        }

        return str;
    },

    /**
     * Scroll (vertically) on a list. Uses native scroll if possible, otherwise use JS scroll
     *
     * @param {Element} element - html element
     * @param {number} to - point to scroll to in pixels
     * @param {number} duration - duration of anim in ms (ignored with native scrolling)
     * @returns {undefined}
     */
    scrollEaseInOut(element, to, duration) {
        let currentTime = 0;
        const start = element.scrollTop,
            change = to - start,
            increment = 20;

        // check if native scroll is supported, if so, execute and return
        if (element.scroll) {
            element.scroll({
                top: to,
                left: 0,
                behavior: 'smooth'
            });
            return;
        }

        const animateScroll = () => {
            currentTime += increment;
            element.scrollTop = this.scrollEaseInOutQuad(currentTime, start, change, duration);

            if (currentTime < duration) {
                setTimeout(animateScroll, increment);
            }
        };

        animateScroll();
    },

    /**
     * Calculate scrolling values for ease-in-out animations
     * sources https://pawelgrzybek.com/page-scroll-in-vanilla-javascript/
     * https://gist.github.com/andjosh/6764939
     *
     * @param {number} time - time time elapsed, used to increment pixels to scroll to
     * @param {number} start - start point in pixels
     * @param {number} change - total change in pixels compared to start
     * @param {number} duration - duration in ms
     * @returns {number} next point of pixels to scroll to
     */
    scrollEaseInOutQuad(time, start, change, duration) {
        time /= duration / 2;

        if (time < 1) {
            return change / 2 * time * time + start;
        }

        time--;

        return -change / 2 * (time * (time - 2) - 1) + start;
    },

    /**
     * Downloads the given blob data as a pdf
     * This supports Firefox, Safari and Chrome (IE/Edge should still be tested)
     * @param {Blob} blob - blob pdf data
     * @param {Object} [options] - options
     * @param {Object} [options.newTab] - open pdf in new tab (default: false)
     * @param {Object} [options.fileName] - open pdf in new tab (default: browser behaviour)
     * @returns {undefined}
     * @throws {Error} exceptions while parsing or downloading
     */
    downloadPdfFromBlob(blob, options = {}) {
        try {
            blob = new Blob([blob], {
                type: 'application/pdf'
            });

            const objectURL = window.URL.createObjectURL(blob);

            // IE doesn't allow using a blob object directly as link href
            // instead it is necessary to use msSaveOrOpenBlob
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob);
                return;
            }

            const link = document.createElement('a');

            link.href = objectURL;

            if (options.newTab) {
                link.rel = 'noopener noreferrer'; // for _blank vulnerability
                link.target = '_blank';
            } else {
                link.download = options.fileName || ''; // tells the browser to download by default
            }

            document.body.appendChild(link); // appending to the body is required for Firefox

            link.click(); // execute the download

            // For Firefox it is necessary to delay revoking the ObjectURL
            let revokeTimeout = window.setTimeout(() => {
                window.URL.revokeObjectURL(objectURL);

                // clear and reset
                document.body.removeChild(link);
                window.clearTimeout(revokeTimeout);
                revokeTimeout = null;
            }, 100);
        } catch (e) {
            throw e;
        }
    },

    /**
     * Parses the given score with the given instructions.
     * Returns 0 by default if the score is unset.
     *
     * @param {number} score - score to parse
     * @param {number} min - min value
     * @param {number} max - max value
     * @param {boolean} floor - floor to an integer
     * @returns {number} integer or float
     */
    parseScore(score, min, max, floor) {

        // when the score is set, floor it, with 1 as a minimum
        // scores higher than 5 should become a 5 (the count)
        if (score > 0 && score <= max) {

            if (!floor) {
                if (score > min) {
                    score = parseFloat(score);
                } else {
                    score = min;
                }
            } else {
                score = Math.floor(score) || min;
            }

        } else if (score > max) {
            score = max;
        } else {
            score = 0;
        }

        return score;
    },

    /**
     * Determine the mobile operating system.
     * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
     *
     * @returns {string|null} Mobile OS
     */
    getMobileOperatingSystem() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;

        // Windows Phone must come first because its UA also contains "Android"
        if (/windows phone/i.test(userAgent)) {
            return Utils.MobileOS.WINDOWS_PHONE;
        }

        if (/android/i.test(userAgent)) {
            return Utils.MobileOS.ANDROID;
        }

        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return Utils.MobileOS.IOS;
        }

        return null;
    },

    /**
     * Translates the given field of an object in the given array if there is a translation available
     *
     * @param {array} data - data array with objects
     * @param {string} fieldName - property of an object in the array
     * @param {string} translatedFieldName - property of an object in the array where the translated value will be set to
     * @param {string} translationKeyFieldName - key that contains the translation key value (can be the same as fieldName)
     * @param {Object} i18n - i18n translation object
     * @param {string} [i18nPrefix] - optional translation key prefix
     * @returns {array} data array
     */
    translateFieldInArray(data, fieldName, translatedFieldName, translationKeyFieldName, i18n, i18nPrefix = '') {
        if (!data || !data.forEach) {
            throw new Error('Data should be an array');
        }

        if (!fieldName) {
            throw new Error('Field name is required');
        }

        if (!i18n) {
            throw new Error('i18n object is required');
        }

        for (let i = 0; i < data.length; i++) {
            if (data[i][translationKeyFieldName]) {
                if (i18n[`${i18nPrefix}${data[i][translationKeyFieldName]}`]) {
                    data[i][translatedFieldName] = i18n[`${i18nPrefix}${data[i][translationKeyFieldName]}`] || data[i][fieldName];
                    continue;
                }
            }

            // fallback
            data[i][translatedFieldName] = data[i][fieldName];
        }

        return data;
    },

    /**
     * Sorts the given data array of objects (statically descending at this point) on the given field name
     * @param {array} data - data array with objects
     * @param {string} fieldName - property of an object in the array (to sort on)
     * @returns {array} data array
     */
    alphabeticallySortFieldInArray(data, fieldName) {
        if (!data || !data.forEach) {
            throw new Error('Data should be an array');
        }

        if (!fieldName) {
            throw new Error('Field name is required');
        }

        data.sort((a, b) => {
            if (a[fieldName].toLowerCase() < b[fieldName].toLowerCase()) {
                return -1;
            }

            if (a[fieldName].toLowerCase() > b[fieldName].toLowerCase()) {
                return 1;
            }

            return 0;
        });

        return data;
    }
};

Utils.MobileOS = {
    ANDROID: 'android',
    IOS: 'ios',
    WINDOWS_PHONE: 'windows_phone'
};

export default Utils;
