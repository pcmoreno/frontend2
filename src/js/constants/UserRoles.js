/**
 * These properties must all have a ROLE_ prefix as these keys will be mangled upon making an obfuscated build.
 * See webpack.config.js UglifyJS regex
 */
const UserRoles = {
    ROLE_APPLICATION_MANAGERS: '37cdd365-15f6-404e-98a1-14aee0bd5d4e',
    ROLE_CONSULTANTS: 'a21d310e-bfad-419f-b0ba-e82fe9929e1f',
    ROLE_BEDRIJFSBUREAU: '60fe5dd4-7055-42d1-b8c4-f9d7c479f02f',
    ROLE_BACKOFFICE: 'e5a2a748-17d3-45b0-a9a6-12a36a9348d1',
    ROLE_CLIENT_CENTER: 'f3fa66b4-1033-4c25-a07b-cb90341e2a00',
    ROLE_ASSESSMENT_TEAM: 'f936f342-1e09-4235-8097-6974687ee0c7',
    ROLE_ASSESSORS: '785a9751-ad55-478b-af04-ff60c6345045',
    ROLE_PARTICIPANT: 'a2635cd5-294b-4601-804d-6ffdf555e964'
};

export default UserRoles;
