/**
 * These properties must all have a ROLE_ prefix as these keys will be mangled upon making an obfuscated build.
 * See webpack.config.js UglifyJS regex
 */
const UserRoles = {
    ROLE_APPLICATION_MANAGERS: 'ROLE_APPLICATION_MANAGERS',
    ROLE_CONSULTANTS: 'ROLE_CONSULTANTS',
    ROLE_BEDRIJFSBUREAU: 'ROLE_BEDRIJFSBUREAU',
    ROLE_BACKOFFICE: 'ROLE_BACKOFFICE',
    ROLE_CLIENT_CENTER: 'ROLE_CLIENT_CENTER',
    ROLE_ASSESSMENT_TEAM: 'ROLE_ASSESSMENT_TEAM',
    ROLE_ASSESSORS: 'ROLE_ASSESSORS',
    ROLE_PARTICIPANT: 'ROLE_PARTICIPANT'
};

export default UserRoles;
