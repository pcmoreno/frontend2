const loggerInstance = Symbol();
const singletonEnforcer = Symbol();

/**
 * @class Logger
 * @description Logger class to output console errors, warnings and notices and logging them to logz.io in production
 */
class Logger {

    constructor(enforcer) {
        if (enforcer !== singletonEnforcer) {
            throw "Cannot construct singleton";
        }
    }

    /**
     * Validates the log object
     *
     * @param {Object} logObject
     * @param {String} logObject.message - Message
     * @param {String} logObject.component - Component name
     * @returns {string|null}
     * @private
     */
    _validateLogObject(logObject) {
        if (!logObject['message']) {
            return 'message is required';
        }

        if (!logObject['component']) {
            return 'component is required';
        }

        return null;
    }

    /**
     * Posts the log object to external logging service in production mode. In development mode the console will
     * be called using console.log, warn and error.
     *
     * @param {Object} logObject
     * @param {String} logObject.message - Message
     * @param {String} logObject.component - Component name
     * @param {String} [logObject.code] - Code from failed network request
     * @param {String} [logObject.response] - response from failed network request
     * @param {String} type - log type [error, warning, notice]
     */
    _postToLogger(logObject, type) {
        let ua = window.userAgent;

        // extend the logObject with user agent and log type by default
        logObject['useragent'] = ua;
        logObject['type'] = type;

        // log to external logging service in production env, or use console in dev env
        if (process.env.NODE_ENV === 'production') {

            // TODO: Implement logz.io post call here

        } else {

            switch (logObject['type']) {
                case 'error':
                    console.error('Error in component ' + logObject.component + ': ' + logObject.message +
                        ', code: ' + logObject.code + ', response: ' + logObject.response);
                    break;
                case 'warning':
                    console.warn('Warning in component ' + logObject.component + ': ' + logObject.message +
                        ', code: ' + logObject.code + ', response: ' + logObject.response);
                    break;
                case 'notice':
                    console.log('Notice in component ' + logObject.component + ': ' + logObject.message +
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
     * @param {Object} logObject
     * @param {String} logObject.message - Message
     * @param {String} logObject.component - Component name
     * @param {String} [logObject.code] - Code from a network request
     * @param {String} [logObject.response] - response from a network request
     */
    notice(logObject) {
        let invalid = this._validateLogObject(logObject);

        if (invalid) {
            console.error(this._validateLogObject(logObject));
            return;
        }

        this._postToLogger(logObject, 'notice');
    }

    /**
     * Logs a warning, for example when something unexpected happens, but will not break the application
     *
     * @param {Object} logObject
     * @param {String} logObject.message - Message
     * @param {String} logObject.component - Component name
     * @param {String} [logObject.code] - Code from a failed network request
     * @param {String} [logObject.response] - response from a failed network request
     */
    warning(logObject) {
        let invalid = this._validateLogObject(logObject);

        if (invalid) {
            console.error(this._validateLogObject(logObject));
            return;
        }

        this._postToLogger(logObject, 'warning');
    }

    /**
     * Logs an error, for example when an API call fails or any other exception occurs
     *
     * @param {Object} logObject
     * @param {String} logObject.message - Message
     * @param {String} logObject.component - Component name
     * @param {String} [logObject.code] - Code from failed a network request
     * @param {String} [logObject.response] - response from a failed network request
     */
    error(logObject) {
        let invalid = this._validateLogObject(logObject);

        if (invalid) {
            console.error(this._validateLogObject(logObject));
            return;
        }

        this._postToLogger(logObject, 'error');
    }

    static get instance() {
        if (!this[loggerInstance]) {
            this[loggerInstance] = new Logger(singletonEnforcer);
        }
        return this[loggerInstance];
    }
}

export default Logger
