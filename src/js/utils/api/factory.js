import API from './api.js';

// map where API instances are stored (multi-ton)
const map = new Map();

/**
 * @class ApiFactory
 * @description ApiFactory creates and retrieves created API instances like a factory and multi-ton
 */
class ApiFactory {

    /**
     * Creates the API instance for the given name/identifier
     * @param {string} apiName - API name/identifier
     * @param {AbstractAuthenticator} authenticator - authenticator instance
     * @returns {API} API instance
     */
    static create(apiName, authenticator) {
        if (map.get(apiName)) {
            throw new Error(`ApiFactory: API ${apiName} already exists`);
        }

        const api = new API(apiName, authenticator);

        map.set(apiName, api);

        return api;
    }

    /**
     * Returns the earlier created and stored API instance from the factory
     * @param {string} apiName - API name/identifier
     * @returns {API} API instance
     */
    static get(apiName) {
        const api = map.get(apiName);

        if (!api) {
            throw new Error(`ApiFactory: API ${apiName} did not exist. Call create first.`);
        }

        return api;
    }
}

export default ApiFactory;
