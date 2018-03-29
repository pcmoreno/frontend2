import { h } from 'preact';

const AuthenticatedComponent = ({ api, component: Component, ...rest }) => ( // eslint-disable-line no-confusing-arrow
    api.getAuthenticator().isAuthenticated() === true
        ? <Component {...rest} />
        : null
);

export default AuthenticatedComponent;
