import Logger from './logger';
import Utils from './utils';
import AppConfig from '../App.config';

/**
 * @class API
 * @description Generic API module to perform network requests to a backend
 */
class API {

    constructor(apiName) {
        this.logger = Logger.instance;
        this.config = AppConfig.api[apiName];

        if (!this.config) {
            throw new Error('AppConfig.api.' + apiName + ' is not set. Cannot create API instance.');
        }
    }

    /**
     * Returns whether the given http status code is considered a warning code
     *
     * @param {number} code - http status code
     * @returns {boolean} is a warning code
     * @private
     */
    static isWarningCode(code) {
        return ((code >= 300 && code <= 399) || code === 404);
    }

    /**
     * Returns whether the given http status code is considered an error code
     *
     * @param {number} code - http status code
     * @returns {boolean} is an error code
     * @private
     */
    static isErrorCode(code) {
        return (code >= 400 && code !== 404);
    }

    /**
     * Executes the fetch call to perform the network request
     *
     * @param {string} url - url with endpoint
     * @param {string} method - http method [get, put, post, options]
     * @param {Object} options - options object
     * @param {Object} [options.urlParams] - url parameters object
     * @param {Object} [options.urlParams.parameters] - url parameters to append on the end of the url
     * @param {Object} [options.urlParams.identifiers] - url identifiers to replace inside the url or endpoint
     * @param {Object} [options.payload] - post body object
     * @param {Object} [options.payload.data] - object or array with un-serialised content
     * @param {Object} [options.payload.type] - type of the payload [json, form]
     * @param {Object} [options.headers] - key value pairs of headers to be set
     * @private
     * @returns {Promise} network request promise
     */
    _executeRequest(url, method, options = {}) {
        let self = this;

        return new Promise((resolve, reject) => {

            // parameters for fetch request
            let requestParams = {
                method,
                headers: {}
            };

            // builds the url with the given identifiers and parameters
            let parsedUrl = self.buildURL(url, options.urlParams);

            // reject when there were still identifiers in the url, that were not replaced
            if (parsedUrl === null) {

                // Log to logger and reject with a proper error message
                self.logger.error({
                    component: 'API',
                    message: 'buildURL failed. Please compare the given identifiers with the endpoint URL: ' + url
                });
                return reject(new Error(self.config.requestFailedMessage));
            }

            // parse payload
            if (options.payload) {

                if (options.payload.type === 'json') {

                    // stringify payload. This will also work with non-objects or arrays, or with null or undefined
                    // it will just parse a string, which is valid JSON. Example: null will become "null"
                    requestParams.body = JSON.stringify(options.payload.data);
                    requestParams.headers['Content-Type'] = 'application/json';

                } else if (options.payload.type === 'form') {

                    // parse as form data (query string: formData[key]=value&formData[key1]=value1
                    requestParams.body = Utils.serialise(
                        options.payload.data,
                        'form',
                        self.config.urlEncodeParams,
                        false // false by default because keys are always required here
                    );
                    requestParams.headers['Content-Type'] = 'application/x-www-form-urlencoded';

                } else {

                    // Log to logger and reject with a proper error message
                    self.logger.error({
                        component: 'API',
                        message: 'Could not parse post body (payload.data). payload.type was not given on request: ' + method.toUpperCase() + ' on URL: ' + parsedUrl
                    });
                    return reject(new Error(self.config.requestFailedMessage));
                }
            }

            // Loop through and set the custom headers
            if (options.headers) {

                // For each header property, read and set key value
                for (let headerKey in options.headers) {

                    // use hasOwnProperty so default object methods and properties (built-in JS) are skipped
                    // https://stackoverflow.com/questions/684672/how-do-i-loop-through-or-enumerate-a-javascript-object
                    if (options.headers.hasOwnProperty(headerKey)) {
                        requestParams.headers[headerKey] = options.headers[headerKey];
                    }
                }
            }

            // execute the request
            return fetch(parsedUrl, requestParams).then(response => {

                // before trying to parse the response, log and return when the response was not ok.
                if (!response.ok) {
                    self.logger.error({
                        component: 'API',
                        message: 'Call to ' + parsedUrl + ' returned code: ' + response.status + ' ' + response.statusText
                    });
                    return reject(new Error(self.config.requestFailedMessage));
                }

                // try to get and return the json response
                return response.json().then(json => {

                    // log and/or reject based on our http status code checks
                    if (API.isWarningCode(response.status)) {

                        self.logger.warning({
                            component: 'API',
                            message: 'Call to ' + parsedUrl + ' returned code: ' + response.status + ' ' + response.statusText + ' with response: ' + JSON.stringify(json)
                        });

                    } else if (API.isErrorCode(response.status)) {
                        self.logger.error({
                            component: 'API',
                            message: 'Call to ' + parsedUrl + ' returned code: ' + response.status + ' ' + response.statusText + ' with response: ' + JSON.stringify(json)
                        });
                        return reject(new Error(self.config.requestFailedMessage));
                    }

                    // return json by default (if it wasnt rejected before)
                    return resolve(json);

                }).catch(error => {

                    // we always expect json, except on 204 no content response
                    if (response.status === 204) {
                        return resolve({});
                    }

                    // consider this as a failed request
                    self.logger.error({
                        component: 'API',
                        message: 'Call to ' + parsedUrl + ' returned code: ' + response.status + ' ' + response.statusText + ' with error: ' + error
                    });
                    return reject(new Error(self.config.requestFailedMessage));
                });

            }).catch(error => {
                self.logger.error({
                    component: 'API',
                    message: 'Call to ' + parsedUrl + ' failed with error: ' + error
                });
                return reject(new Error(self.config.requestFailedMessage));
            });
        });
    }

    /**
     * Builds the url with the given identifiers and parameters
     * identifiers: {id:1} will replace '{id}' in the url with 1
     * parameters: all parameters (including arrays) are serialised, eventually with url encoding
     * and/or index parameters. Index parameters are used in arrays. With this skip option on the result will be
     * k[]=v rather than k[0]=v
     *
     * @param {string} url - url to replace and append the given identifiers and parameters
     * @param {Object} urlParams - parameters object for url identifiers and parameters
     * @param {Object} [urlParams.identifiers] - Key value pairs for url identifiers
     * @param {Object} [urlParams.parameters] - Key value pairs for url parameters (child array allowed)
     * @returns {string|null} built url or null in case of unknown url identifiers
     * @private
     */
    buildURL(url, urlParams) {
        let buildUrl = url;

        if (urlParams) {

            let urlIdentifiers = urlParams.identifiers,
                urlParameters = urlParams.parameters;

            // replace url identifiers (NOT parameters)
            if (urlIdentifiers) {

                // map identifiers (e.g. id becomes {id})
                let keys = Object.keys(urlIdentifiers).map(x => '{' + x + '}');

                // replace all identifiers with given values
                buildUrl = Utils.replaceString(
                    buildUrl,
                    keys,
                    Object.values(urlIdentifiers)
                );
            }

            // append url parameters without url encoding
            if (urlParameters && buildUrl !== null) {
                buildUrl = Utils.buildQueryString(
                    buildUrl,
                    urlParameters,
                    this.config.urlEncodeParams,
                    this.config.skipPrefixIndexParams
                );
            }
        }

        // reset build url and return null if there are unreplaced identifiers
        // ~ shifts the bits like: -(i + 1) (invert plus 1). Makes it superfluous to check on -1 or >= 0
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Bitwise_NOT
        if (~buildUrl.indexOf('{') && ~buildUrl.indexOf('}')) {
            buildUrl = null;
        }

        return buildUrl;
    }

    /**
     * Executes a get request to the given url + endpoint with the given payload/headers
     *
     * @param {string} baseUrl - baseUrl
     * @param {string} endpoint - endpoint
     * @param {Object} options - options object
     * @param {Object} [options.urlParams] - url parameters object
     * @param {Object} [options.urlParams.parameters] - url parameters to append on the end of the url
     * @param {Object} [options.urlParams.identifiers] - url identifiers to replace inside the url or endpoint
     * @param {Object} [options.payload] - post body object
     * @param {Object} [options.payload.data] - object or array with un-serialised content
     * @param {Object} [options.payload.type] - type of the payload [json, form]
     * @param {Object} [options.headers] - key value pairs of headers to be set
     * @returns {Promise} network request promise
     */
    get(baseUrl, endpoint, options) {
        return this._executeRequest(baseUrl + endpoint, 'get', options);
    }

    /**
     * Executes a post request to the given url + endpoint with the given payload/headers
     *
     * @param {string} baseUrl - baseUrl
     * @param {string} endpoint - endpoint
     * @param {Object} options - options object
     * @param {Object} [options.urlParams] - url parameters object
     * @param {Object} [options.urlParams.parameters] - url parameters to append on the end of the url
     * @param {Object} [options.urlParams.identifiers] - url identifiers to replace inside the url or endpoint
     * @param {Object} [options.payload] - post body object
     * @param {Object} [options.payload.data] - object or array with un-serialised content
     * @param {Object} [options.payload.type] - type of the payload [json, form]
     * @param {Object} [options.headers] - key value pairs of headers to be set
     * @returns {Promise} network request promise
     */
    post(baseUrl, endpoint, options) {
        return this._executeRequest(baseUrl + endpoint, 'post', options);
    }

    /**
     * Executes a put request to the given url + endpoint with the given payload/headers
     *
     * @param {string} baseUrl - baseUrl
     * @param {string} endpoint - endpoint
     * @param {Object} options - options object
     * @param {Object} [options.urlParams] - url parameters object
     * @param {Object} [options.urlParams.parameters] - url parameters to append on the end of the url
     * @param {Object} [options.urlParams.identifiers] - url identifiers to replace inside the url or endpoint
     * @param {Object} [options.payload] - post body object
     * @param {Object} [options.payload.data] - object or array with un-serialised content
     * @param {Object} [options.payload.type] - type of the payload [json, form]
     * @param {Object} [options.headers] - key value pairs of headers to be set
     * @returns {Promise} network request promise
     */
    put(baseUrl, endpoint, options) {
        return this._executeRequest(baseUrl + endpoint, 'put', options);
    }

    /**
     * Executes an options request to the given url + endpoint with the given payload/headers
     *
     * @param {string} baseUrl - baseUrl
     * @param {string} endpoint - endpoint
     * @param {Object} options - options object
     * @param {Object} [options.urlParams] - url parameters object
     * @param {Object} [options.urlParams.parameters] - url parameters to append on the end of the url
     * @param {Object} [options.urlParams.identifiers] - url identifiers to replace inside the url or endpoint
     * @param {Object} [options.payload] - post body object
     * @param {Object} [options.payload.data] - object or array with un-serialised content
     * @param {Object} [options.payload.type] - type of the payload [json, form]
     * @param {Object} [options.headers] - key value pairs of headers to be set
     * @returns {Promise} network request promise
     */
    options(baseUrl, endpoint, options) {
        return this._executeRequest(baseUrl + endpoint, 'options', options);
    }
}

export default API;
