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
     * Returns the login redirect
     * @returns {string} login redirect
     */
    getLoginRedirect() {
        return this.config.loginRedirect;
    }

    /**
     * Returns the allowed roles for the given component and action
     * @param {string} component - component name
     * @param {string} action - action name
     * @returns {Array} roles array
     */
    getAllowedRolesForComponentAction(component, action) {
        const config = this.getComponentConfig(component);

        if (!config) {
            throw new Error(`Authoriser component: ${component} did not exist in the configuration`);
        }

        if (!config[action]) {
            throw new Error(`Authoriser action: ${action} did not exist for component: ${component}`);
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

        if (!user) {
            return false;
        }

        if (!component) {
            throw new Error(`Component ${component} was not defined in the configuration`);
        }

        if (!action) {
            throw new Error(`Action ${action} was not defined in the configuration`);
        }

        const allowedRoles = this.getAllowedRolesForComponentAction(component, action);
        const userRoles = user.getRoles().map(role => role.toLowerCase());
        let allowed = false;

        // loop through all allowed roles (lowercase) and match them with the user role
        for (let i in allowedRoles) {
            if (allowedRoles.hasOwnProperty(i)) {
                if (~userRoles.indexOf(allowedRoles[i].toLowerCase())) {
                    allowed = true;
                    break;
                }
            }
        }

        return allowed;
    }
}

export default AbstractAuthoriser;
