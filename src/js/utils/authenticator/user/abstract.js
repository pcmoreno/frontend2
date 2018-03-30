/**
 * @class AbstractUser
 * @description Generic User interface that can be extended
 */
class AbstractUser {

    /**
     * Constructs the User
     * @param {Object} props - user properties
     * @param {string} props.username - username
     * @param {Array} props.roles - roles array
     * @param {string} [props.firstName] - roles array
     * @param {string} [props.infix] - roles array
     * @param {string} [props.lastName] - roles array
     */
    constructor(props) {

        if (!props.username) {
            throw new Error('AbstractUser: username cannot be empty.');
        }

        if (!props.roles || props.roles.length === 0) {
            throw new Error('AbstractUser: roles[] cannot be empty.');
        }

        this.username = props.username;
        this.roles = props.roles;

        this.firstName = props.firstName || null;
        this.infix = props.infix || null;
        this.lastName = props.lastName || null;
    }

    /**
     * Returns the username
     * @returns {string} username
     */
    getUsername() {
        return this.username;
    }

    /**
     * Returns the roles
     * @returns {Array} roles
     */
    getRoles() {
        return this.roles;
    }

    /**
     * Returns the firstName
     * @returns {string|null} firstName
     */
    getFirstName() {
        return this.firstName;
    }

    /**
     * Returns the infix
     * @returns {string|null} infix
     */
    getInfix() {
        return this.infix;
    }

    /**
     * Returns the lastName
     * @returns {string|null} lastName
     */
    getLastName() {
        return this.lastName;
    }
}

export default AbstractUser;
