import Utils from './utils';
import AppConfig from '../App.config';

let loggerInstance = null;

/**
 * @class Logger
 * @description Logger class to output console errors, warnings and notices and logging them to logz.io in production
 */
class Logger {

    constructor() {
        this.env = process.env.NODE_ENV;
        this.sessionId = Utils.uuid();
        this.loggerToken = '';
        this.baseUrl = AppConfig.api.neon.baseUrl.replace('/api', '');
        this.devMode = AppConfig.logger.devMode;

        if (this.devMode) {
            this.baseUrl = AppConfig.logger.devModeBaseUrl;
        }

        if (this.env === 'production' || this.env === 'acceptance' || this.devMode) {

            // define a new console
            console = (function(oldCons, logger) { // eslint-disable-line no-console, no-global-assign
                return {
                    log: message => {
                        oldCons.log(message);
                    },
                    info: message => {
                        oldCons.info(message);
                    },
                    warn: message => {

                        logger.postToLogger({
                            message
                        }, 'warning');

                        oldCons.warn(message);
                    },
                    error: message => {

                        logger.postToLogger({
                            message
                        }, 'error');

                        oldCons.error(message);
                    }
                };
            }(window.console, this));

            // Then redefine the old console
            window.console = console;
        }
    }

    /**
     * Validates the log object
     *
     * @param {Object} logObject - log properties
     * @param {string} logObject.message - Message
     * @param {string} logObject.component - Component name
     * @returns {boolean} - logObject validated
     */
    static validateLogObject(logObject) {
        if (!logObject.message) {
            console.error('message is required'); // eslint-disable-line no-console
            return false;
        }

        if (!logObject.component) {
            console.error('component is required'); // eslint-disable-line no-console
            return false;
        }

        return true;
    }

    /**
     * Get the logz.io API token, request it or simply return the one that we cached
     * @returns {Promise<any>} promise
     */
    getToken() {
        return new Promise((resolve, reject) => {

            // check if we already requested the token before, if not, request it
            if (this.loggerToken) {
                return resolve(this.loggerToken);
            }

            // fetch the token from the API
            return fetch(`${AppConfig.api.neon.baseUrl}${AppConfig.api.neon.endpoints.logzioToken}`, {
                method: 'GET'
            }).then(response => {

                response.json().then(json => {
                    if (json && json.key) {
                        this.loggerToken = json.key;
                        resolve(json.key);
                    } else {
                        reject(new Error('Could not fetch logger token'));
                    }
                });

            }).catch(error => {
                reject(error);
            });
        });
    }

    /**
     * Posts the log object to external logging service in production mode. In development mode the console will
     * be called using console.log, warn and error.
     *
     * @param {Object} logObject - log properties (will all be logged)
     * @param {string} logObject.message - Message
     * @param {string} logObject.component - Component name
     * @param {string} [logObject.requestUrl] - Requested url (api)
     * @param {string} [logObject.responseText] - Response text (api)
     * @param {string} [logObject.requestOptions] - Request options as json string (api)
     * @param {string} [logObject.responseBody] - Response body as json string (api)
     * @param {number} [logObject.responseStatus] - Response status (api)
     * @param {string} type - log type [error, warning, notice]
     * @returns {undefined}
     */
    postToLogger(logObject, type) {
        const ua = navigator.userAgent;

        // extend the logObject with user agent and log type by default
        logObject.application = 'neon-frontend';
        logObject.userAgent = ua;
        logObject.type = type;
        logObject.session = this.sessionId;
        logObject.environment = this.env;
        logObject.applicationUrl = window && window.location && window.location.href;
        logObject.neonApiResponse = logObject.response ? JSON.stringify(logObject.response) : null;

        // remove old key names (not allowed by our current logz.io mapping
        delete logObject.response;

        // log to external logging service in production env, or use console in dev env
        if (this.env === 'production' || this.env === 'acceptance' || this.devMode) {

            // get the token and log the message
            this.getToken().then(token => {

                // logz.io post call
                fetch(`${this.baseUrl}/logzio?token=${token}`, {
                    method: 'POST',
                    body: JSON.stringify(logObject)
                });
            });

        } else {
            switch (logObject.type) {
                case 'error':
                    console.error('Error in component ' + logObject.component + ': ', logObject); // eslint-disable-line no-console,prefer-template
                    break;
                case 'warning':
                    console.warn('Warning in component ' + logObject.component + ': ', logObject); // eslint-disable-line no-console,prefer-template
                    break;
                case 'notice':
                    console.log('Notice in component ' + logObject.component + ': ', logObject); // eslint-disable-line no-console,prefer-template
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * Logs a notice, for example when something interesting happens
     *
     * @param {Object} logObject - log properties
     * @param {string} logObject.message - Message
     * @param {string} logObject.component - Component name
     * @param {string} [logObject.code] - Code from a network request
     * @param {string} [logObject.response] - response from a network request
     * @returns {undefined}
     */
    notice(logObject) {
        if (Logger.validateLogObject(logObject)) {
            this.postToLogger(logObject, 'notice');
        }
    }

    /**
     * Logs a warning, for example when something unexpected happens, but will not break the application
     *
     * @param {Object} logObject - log properties
     * @param {string} logObject.message - Message
     * @param {string} logObject.component - Component name
     * @param {string} [logObject.code] - Code from a failed network request
     * @param {string} [logObject.response] - response from a failed network request
     * @returns {undefined}
     */
    warning(logObject) {
        if (Logger.validateLogObject(logObject)) {
            this.postToLogger(logObject, 'warning');
        }
    }

    /**
     * Logs an error, for example when an API call fails or any other exception occurs
     *
     * @param {Object} logObject - log properties
     * @param {string} logObject.message - Message
     * @param {string} logObject.component - Component name
     * @param {string} [logObject.code] - Code from failed a network request
     * @param {string} [logObject.response] - response from a failed network request
     * @returns {undefined}
     */
    error(logObject) {
        if (Logger.validateLogObject(logObject)) {
            this.postToLogger(logObject, 'error');
        }
    }

    static get instance() {
        if (!loggerInstance) {
            loggerInstance = new Logger();
        }
        return loggerInstance;
    }
}

export default Logger;
