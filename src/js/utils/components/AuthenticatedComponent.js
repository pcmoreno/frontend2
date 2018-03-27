import { h } from 'preact';
import Redirect from './Redirect';

const AuthenticatedComponent = ({ api, redirectPath, component: Component, ...rest }) => ( // eslint-disable-line no-confusing-arrow
    api.getAuthenticator().isAuthenticated() === true
        ? <Component {...rest} />
        : <Redirect path='/login' redirectPath={redirectPath} />
);

export default AuthenticatedComponent;
