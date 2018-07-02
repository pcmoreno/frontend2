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
     * @param {string} [props.firstName] - firstName
     * @param {string} [props.infix] - infix
     * @param {string} [props.lastName] - lastName
     * @param {string} [props.id] - id
     */
    constructor(props) {

        if (!props.username) {
            throw new Error('AbstractUser: username cannot be empty.');
        }

        if (!props.roles || props.roles.length === 0) {
            throw new Error('AbstractUser: roles[] cannot be empty.');
        }

        if (!props.id) {
            throw new Error('AbstractUser: id cannot be empty.');
        }

        this.username = props.username;
        this.roles = props.roles;

        this.firstName = props.firstName || '';
        this.infix = props.infix || '';
        this.lastName = props.lastName || '';
        this.id = props.id;
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

    /**
     * Returns the id
     * @returns {string|number} id
     */
    getId() {
        return this.id;
    }


    /**
     * Returns the display name / full name
     * @returns {string} display/full name
     */
    getDisplayName() {
        if (this.infix !== '') {
            return `${this.firstName} ${this.infix} ${this.lastName}`;
        }

        return `${this.firstName} ${this.lastName}`;
    }
}

export default AbstractUser;
