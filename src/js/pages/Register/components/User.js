import { h, render } from 'preact';
import Redirect from '../../../utils/components/Redirect';
import Register from './../components/Register/Register';
import Login from './../components/Login/Login';
import AbstractRegistration from './AbstractRegistration';
import AppConfig from '../../../App.config';

/** @jsx h */

const loginEndpoint = AppConfig.api.neon.loginRedirect;
const registrationSuccessful = '?registrationSuccess=true';

/**
 * @inheritDoc
 * @see AbstractRegistration
 */
export default class User extends AbstractRegistration {
    render() {
        let component = null;

        const {
            accountHasRoleSlug,
            languageId,
            isRegistered,
            showLogin,
            loginError,
            registerError,
            registerButtonDisabled,
            loginButtonDisabled
        } = this.localState;

        // do not render when we don't have participant id or don't know the approval status
        if (!accountHasRoleSlug || !languageId) {
            return null;
        }

        // render register component
        if (!isRegistered) {

            // show participant login when this was requested
            if (showLogin) {

                component = <Login
                    i18n={ this.i18n }
                    language={ languageId }
                    error={ loginError }
                    buttonDisabled={ loginButtonDisabled }
                    emailInput={ this.localState.loginFields.username }
                    onSubmit={ this.onLoginAccount.bind(this) }
                    onChange={ this.onChangeFieldLoginForm.bind(this) }
                    showLogin={ this.switchToLogin.bind(this) }
                />;

            } else {

                // show register by default
                component = <Register
                    i18n={ this.i18n }
                    error={ registerError }
                    buttonDisabled={ registerButtonDisabled }
                    emailInput={ this.localState.registerFields.username }
                    onSubmit={ this.onRegisterAccount.bind(this) }
                    onChange={ this.onChangeFieldRegistrationForm.bind(this) }
                    showLogin={ this.switchToLogin.bind(this) }
                />;
            }

        } else if (isRegistered) {
            render(<Redirect to={loginEndpoint + registrationSuccessful} refresh={true}/>);
        }

        // return the correct register component
        return component;
    }
}
