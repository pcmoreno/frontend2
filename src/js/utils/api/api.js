import Logger from '../logger';
import Utils from '../utils';
import AppConfig from '../../App.config';

/**
 * @class API
 * @description Generic API module to perform network requests to a backend
 */
class API {

    constructor(apiName, authenticator, authoriser) {
        this.logger = Logger.instance;
        this.config = AppConfig.api[apiName];
        this.authenticator = authenticator;
        this.authoriser = authoriser;

        if (!this.config) {
            throw new Error(`AppConfig.api.${apiName} is not set. Cannot create API instance.`);
        }
    }

    /**
     * Returns the API config of this API instance.
     * @returns {Object} API config
     */
    getConfig() {
        return this.config;
    }

    /**
     * Returns the baseUrl of this API instance.
     * @returns {string} base url
     */
    getBaseUrl() {
        return this.config.baseUrl;
    }

    /**
     * Returns the endpoints of this API instance.
     * @returns {Object} key-value pair based endpoints
     */
    getEndpoints() {
        return this.config.endpoints;
    }

    /**
     * Returns the authenticator of this API instance.
     * @returns {AbstractAuthenticator} authenticator instance
     */
    getAuthenticator() {
        return this.authenticator;
    }

    /**
     * Returns the authoriser of this API instance.
     * @returns {AbstractAuthoriser} authoriser instance
     */
    getAuthoriser() {
        return this.authoriser;
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
     * Logs a warning to the logger with the given message
     * @param {string} type - type 'warning' or 'error'
     * @param {string} [url] - url
     * @param {Object} [options] - request options
     * @param {Object} [response] - response object
     * @param {Object} [jsonResponse] - json object response or error string
     * @returns {undefined}
     */
    logApiMessage(type, url = '', options = {}, response = {}, jsonResponse = {}) {
        const loggingExclusions = this.config.loggingExclusions;

        // check if this url contains excluded endpoints, stop if so
        for (let i = 0; i < loggingExclusions.endpoints.length; i++) {
            const endpoint = loggingExclusions.endpoints[i];

            if (~url.indexOf(endpoint)) {
                return;
            }
        }

        // check if there are headers that should be excluded from the logging
        loggingExclusions.headers.forEach(header => {
            if (options.headers && options.headers[header]) {
                options.headers[header] = null;
                delete options.headers[header];
            }
        });

        // check if there are post body values that should be excluded from the logging
        loggingExclusions.postBody.forEach(fieldKey => {
            if (options.payload && options.payload.data && options.payload.data[fieldKey]) {
                options.payload.data[fieldKey] = null;
                delete options.payload.data[fieldKey];
            }
        });

        // check if there are response body values that should be excluded from the logging
        loggingExclusions.responseBody.forEach(fieldKey => {
            if (jsonResponse[fieldKey]) {
                jsonResponse[fieldKey] = null;
                delete jsonResponse[fieldKey];
            }
        });

        // stringify the response if necessary
        if (typeof jsonResponse === 'object') {
            jsonResponse = JSON.stringify(jsonResponse);
        }

        // call the logger
        if (type === 'warning') {
            this.logger.warning({
                component: 'API',
                message: `Call to ${url}, with options: ${JSON.stringify(options)}, returned: ${response.status} ${response.statusText}, with response: ${jsonResponse}`
            });
        } else if (type === 'error') {
            this.logger.error({
                component: 'API',
                message: `Call to ${url}, with options: ${JSON.stringify(options)}, returned: ${response.status} ${response.statusText}, with response/error: ${jsonResponse}`
            });
        }
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
    executeRequest(url, method, options = {}) {
        const self = this;
        const cachedRequest = {
            url,
            method,
            options
        };

        return new Promise((resolve, reject) => {

            // parameters for fetch request
            let requestParams = {
                method,
                headers: {}
            };

            // allow to use cross-domain cookies for authentication
            // https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
            if (this.config.credentials) {
                requestParams.credentials = this.config.credentials;
            }

            // builds the url with the given identifiers and parameters
            const parsedUrl = self.buildURL(url, options.urlParams);

            // reject when there were still identifiers in the url, that were not replaced
            if (parsedUrl === null) {

                // Log to logger and reject with a proper error message
                self.logger.error({
                    component: 'API',
                    message: `buildURL failed. Please compare the given identifiers: ${options.urlParams} with the endpoint URL: ${url}`
                });
                return reject(new Error(self.config.requestFailedMessage));
            }

            // parse payload
            if (options.payload) {
                try {
                    requestParams = self.buildPayload(requestParams, options.payload);
                } catch (e) {
                    return reject(new Error(self.config.requestFailedMessage));
                }
            }

            // Loop through and set the custom headers
            if (options.headers) {
                requestParams = this.buildRequestHeaders(requestParams, options.headers);
            }

            // execute the request
            return fetch(parsedUrl, requestParams).then(response => {

                // try to get and return the json response
                response.json().then(json => {

                    // check if this was an input validation error
                    if (response.status === 400 && json.errors) {
                        self.logApiMessage('warning', parsedUrl, options, response, json);
                        return resolve({ errors: json.errors });
                    }

                    // renew token if 401 was returned, and try the same API call again
                    if (response.status === 401) {
                        if (!options.retry) {
                            return self.authenticator.refreshAndGetUser().then(() => {
                                cachedRequest.options.retry = true;
                                return self.executeRequest(cachedRequest.url, cachedRequest.method, cachedRequest.options);
                            });
                        }

                        // we already retried and we still get 401. Consider this logged out...
                        return self.authenticator.logout().then(() => {
                            window.location = self.getConfig().logoutRedirect;
                        });
                    }

                    // log and/or reject based on our http status code checks
                    if (API.isWarningCode(response.status)) {
                        self.logApiMessage('warning', parsedUrl, options, response, json);

                    } else if (API.isErrorCode(response.status) || !response.ok) {
                        self.logApiMessage('error', parsedUrl, options, response, json);
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
                    self.logApiMessage('error', parsedUrl, options, response, error);
                    return reject(new Error(self.config.requestFailedMessage));
                });

            }).catch(error => {
                self.logApiMessage('error', parsedUrl, options, {}, error);
                return reject(new Error(self.config.requestFailedMessage));
            });
        });
    }

    /**
     * Builds and appends the post body and headers to the given request parameters
     * @param {Object} requestParams - request parameters
     * @param {Object} payload - post body object
     * @param {Object} payload.data - object or array with un-serialised content
     * @param {string} payload.type - type of the payload [json, form]
     * @param {string} [payload.formKey] - optional form key
     * @returns {Object} Request params with post body appended
     */
    buildPayload(requestParams, payload = {}) {

        // return by default
        if (!payload) {
            return requestParams;
        }

        if (payload.type === 'json') {

            // stringify payload. This will also work with non-objects or arrays, or with null or undefined
            // it will just parse a string, which is valid JSON. Example: null will become "null"
            requestParams.body = JSON.stringify(payload.data);
            requestParams.headers['Content-Type'] = 'application/json';

        } else if (payload.type === 'form') {

            // parse as form data (query string: formData[key]=value&formData[key1]=value1
            requestParams.body = Utils.serialise(
                payload.data,
                payload.formKey || 'form',
                this.config.urlEncodeParams,
                false // false by default because keys are always required here
            );
            requestParams.headers['Content-Type'] = 'application/x-www-form-urlencoded';

        } else {

            // Log to logger and reject with a proper error message
            this.logger.error({
                component: 'API',
                message: `Could not parse post body (payload.data). payload.type was not given on request: ${JSON.stringify(requestParams)}`
            });
            throw new Error(`Could not parse post body (payload.data). payload.type was not given on request: ${JSON.stringify(requestParams)}`);
        }

        return requestParams;
    }

    /**
     * Builds and appends the headers to the given request parameters
     * @param {Object} requestParams - request parameters
     * @param {Object} headers - headers as key-value pairs
     * @returns {Object} Request params with post body appended
     */
    buildRequestHeaders(requestParams, headers = {}) {

        // return by default
        if (!headers) {
            return requestParams;
        }

        // For each header property, read and set key value
        for (const headerKey in headers) {

            // use hasOwnProperty so default object methods and properties (built-in JS) are skipped
            // https://stackoverflow.com/questions/684672/how-do-i-loop-through-or-enumerate-a-javascript-object
            if (headers.hasOwnProperty(headerKey)) {
                requestParams.headers[headerKey] = headers[headerKey];
            }
        }

        return requestParams;
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

            const urlIdentifiers = urlParams.identifiers,
                urlParameters = urlParams.parameters;

            // replace url identifiers (NOT parameters)
            if (urlIdentifiers) {

                // map identifiers (e.g. id becomes {id})
                const keys = Object.keys(urlIdentifiers).map(x => `{${x}}`);

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
        return this.executeRequest(baseUrl + endpoint, 'get', options);
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
        return this.executeRequest(baseUrl + endpoint, 'post', options);
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
        return this.executeRequest(baseUrl + endpoint, 'put', options);
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
        return this.executeRequest(baseUrl + endpoint, 'options', options);
    }
}

export default API;
