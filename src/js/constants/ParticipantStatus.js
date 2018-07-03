/**
 * These properties must all have a STATUS_ prefix as these keys will be mangled upon making an obfuscated build.
 * See webpack.config.js UglifyJS regex
 */
const ParticipantStatus = {
    STATUS_ADDED: 'added',
    STATUS_INVITED: 'invited',
    STATUS_TERMS_AND_CONDITIONS_ACCEPTED: 'termsAndConditionsAccepted',
    STATUS_INVITATION_ACCEPTED: 'invitationAccepted',
    STATUS_REDIRECTED_TO_ONLINE: 'redirectedToOnline',
    STATUS_STARTED: 'started',
    STATUS_HNA_FINISHED: 'hnaFinished',
    STATUS_PERSONA_FIT_FINISHED: 'personaFitFinished'
};

export default ParticipantStatus;
