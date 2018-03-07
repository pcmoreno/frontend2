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
     * @param {Object} logObject - log properties
     * @param {string} logObject.message - Message
     * @param {string} logObject.component - Component name
     * @param {string} [logObject.code] - Code from failed network request
     * @param {string} [logObject.response] - response from failed network request
     * @param {string} type - log type [error, warning, notice]
     * @returns {undefined}
     */
    _postToLogger(logObject, type) {
        let ua = window.userAgent;

        // extend the logObject with user agent and log type by default
        logObject.useragent = ua;
        logObject.type = type;

        // log to external logging service in production env, or use console in dev env
        if (this.env === 'production') {

            // TODO: Implement logz.io post call here

        } else {

            switch (logObject.type) {
                case 'error':
                    console.error('Error in component ' + logObject.component + ': ' + logObject.message + // eslint-disable-line no-console,prefer-template
                        ', code: ' + logObject.code + ', response: ' + logObject.response);
                    break;
                case 'warning':
                    console.warn('Warning in component ' + logObject.component + ': ' + logObject.message + // eslint-disable-line no-console,prefer-template
                        ', code: ' + logObject.code + ', response: ' + logObject.response);
                    break;
                case 'notice':
                    console.log('Notice in component ' + logObject.component + ': ' + logObject.message + // eslint-disable-line no-console,prefer-template
                        ', code: ' + logObject.code + ', response: ' + logObject.response);
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
