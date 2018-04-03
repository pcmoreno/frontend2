import AppConfig from '../../App.config';

/**
 * @class AbstractAuthoriser
 * @description Generic Authoriser interface that can be extended
 */
class AbstractAuthoriser {

    /**
     * Constructs the authoriser
     * @param {string} authoriserName - authoriser name
     */
    constructor(authoriserName) {
        this.config = AppConfig.authoriser[authoriserName];

        if (!this.config) {
            throw new Error(`AppConfig.authoriser.${authoriserName} is not set. Cannot create authoriser instance.`);
        }
    }

    /**
     * Returns the authorisation config for the given component
     * @param {string} component - component name
     * @returns {*|null} config or null
     */
    getComponentConfig(component) {
        return this.config[component] || null;
    }

    /**
     * Returns the allowed roles for the given component and action
     * @param {string} component - component name
     * @param {string} action - action name
     * @returns {Array} roles array
     */
    getAllowedRolesForComponentAction(component, action) {
        const config = this.getComponentConfig(component);

        if (!config || !config[action]) {
            throw new Error(`Authoriser component ${component} and/or action ${action} did not exist in the configuration`);
        }

        return config[action];
    }

    /**
     * Returns whether this user is allowed to see or perform an action in a component
     * @param {AbstractUser} user - user
     * @param {string} component - component name
     * @param {string} action - action
     * @returns {boolean} allowed
     */
    authorise(user, component, action) {

        if (!user || !component || !action) {
            return false;
        }

        const allowedRoles = this.getAllowedRolesForComponentAction(component, action);
        const userRoles = user.getRoles();
        let allowed = false;

        for (let i in allowedRoles) {
            if (allowedRoles.hasOwnProperty(i)) {
                if (~userRoles.indexOf(allowedRoles[i])) {
                    allowed = true;
                    break;
                }
            }
        }

        return allowed;
    }
}

export default AbstractAuthoriser;
