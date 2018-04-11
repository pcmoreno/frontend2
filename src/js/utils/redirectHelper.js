const helperInstance = Symbol('RedirectHelper Instance');
const singletonEnforcer = Symbol('singleton Enforcer');

/**
 * @class RedirectHelper
 */
class RedirectHelper {

    constructor(enforcer) {
        if (enforcer !== singletonEnforcer) {
            throw new Error('Cannot construct singleton');
        }

        this.redirectPath = null;
    }

    /**
     * Sets the redirect path
     * @param {string} path - redirect path
     * @returns {undefined}
     */
    setRedirectPath(path) {
        if (path) {
            console.log('set redirect path to: ', path);
            this.redirectPath = path;
        }
    }

    /**
     * Gets the redirect path
     * @returns {null|string} redirect path
     */
    getRedirectPath() {
        return this.redirectPath;
    }

    static get instance() {
        if (!this[helperInstance]) {
            this[helperInstance] = new RedirectHelper(singletonEnforcer);
        }
        return this[helperInstance];
    }
}

export default RedirectHelper;
