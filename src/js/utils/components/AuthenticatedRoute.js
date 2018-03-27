import { h } from 'preact';
import Redirect from './Redirect';
import AsyncRoute from 'preact-router';

const AuthenticatedRoute = ({ api, redirectPath, ...rest }) => ( // eslint-disable-line no-confusing-arrow
    api.getAuthenticator().isAuthenticated() === true
        ? <AsyncRoute {...rest} />
        : <Redirect path='/login' redirectPath={redirectPath} />
);

export default AuthenticatedRoute;
