import Utils from './utils';

const loggerInstance = Symbol('logger Instance');
const singletonEnforcer = Symbol('singleton Enforcer');

/**
 * @class Logger
 * @description Logger class to output console errors, warnings and notices and logging them to logz.io in production
 */
class Logger {

    constructor(enforcer) {
        if (enforcer !== singletonEnforcer) {
            throw new Error('Cannot construct singleton');
        }

        this.env = process.env.NODE_ENV;
        this.sessionId = Utils.uuid();
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
    _postToLogger(logObject, type) {
        let ua = window.userAgent;

        // extend the logObject with user agent and log type by default
        logObject.application = 'frontend';
        logObject.userAgent = ua;
        logObject.type = type;
        logObject.session = this.sessionId;
        logObject.environment = this.env;
        logObject.applicationUrl = window && window.location && window.location.href;

        // log to external logging service in production env, or use console in dev env
        if (this.env === 'production') {

            // TODO: Implement logz.io post call here

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
            this._postToLogger(logObject, 'notice');
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
            this._postToLogger(logObject, 'warning');
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
            this._postToLogger(logObject, 'error');
        }
    }

    static get instance() {
        if (!this[loggerInstance]) {
            this[loggerInstance] = new Logger(singletonEnforcer);
        }
        return this[loggerInstance];
    }
}

export default Logger;
