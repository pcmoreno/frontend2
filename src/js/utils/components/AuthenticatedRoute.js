import { h } from 'preact';
import Redirect from './Redirect';
import AsyncRoute from 'preact-router';

const AuthenticatedRoute = ({ api, path, ...rest }) => ( // eslint-disable-line no-confusing-arrow
    api.getAuthenticator().isAuthenticated() === true
        ? <AsyncRoute {...rest} />
        : <Redirect path={`/login?redirectPath=${path}`} />
);

export default AuthenticatedRoute;
