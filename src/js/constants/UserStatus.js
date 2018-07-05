/**
 * These properties must all have a STATUS_ prefix as these keys will be mangled upon making an obfuscated build.
 * See webpack.config.js UglifyJS regex
 */
const UserStatus = {
    STATUS_ADDED: 'added',
    STATUS_INVITED: 'invited',
    STATUS_INVITATION_ACCEPTED: 'invitationAccepted'
};

export default UserStatus;
