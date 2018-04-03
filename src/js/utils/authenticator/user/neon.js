import AbstractUser from './abstract';

/**
 * @class NeonUser
 * @description NeonUser
 */
class NeonUser extends AbstractUser {

    /**
     * Constructs the User
     * @param {Object} props - user properties
     * @param {string} props.username - username
     * @param {Array} props.roles - roles array
     */
    constructor(props) {
        super({
            username: props.username,
            roles: props.roles,
            firstName: props.firstName,
            infix: props.infix,
            lastName: props.lastName
        });

        this.gender = props.gender || null;
        this.educationLevel = props.educationLevel || null;
    }

    /**
     * Returns the gender
     * @returns {string|null} gender
     */
    getGender() {
        return this.gender;
    }

    /**
     * Returns the education level
     * @returns {string|null} education level
     */
    getEducationLevel() {
        return this.educationLevel;
    }
}

export default NeonUser;
