import { h, render } from 'preact';
import Terms from './../components/Terms/Terms';
import Redirect from 'neon-frontend-utils/src/components/Redirect';
import Register from './../components/Register/Register';
import Login from './../components/Login/Login';
import AbstractRegistration from './AbstractRegistration';
import AppConfig from '../../../App.config';

/** @jsx h */

const termsAcceptedStatus = 'termsAndConditionsAccepted';
const loginEndpoint = AppConfig.api.neon.loginRedirect;
const registrationSuccessful = '?registrationSuccess=true';

/**
 * @inheritDoc
 * @see AbstractRegistration
 */
export default class Participant extends AbstractRegistration {
    constructor(props) {
        super(props);

        // extend localState from abstract
        this.localState.termsAccepted = props.accountStatus === termsAcceptedStatus;
        this.localState.approvalCheckboxChecked = false;
        this.localState.approvalButtonDisabled = true;
    }

    onApproveTerms(event) {
        event.preventDefault();

        if (this.localState.approvalCheckboxChecked) {

            // disable button to avoid bashing
            this.localState.approvalButtonDisabled = true;
            this.setState(this.localState);

            // API call that will store the participant session status (Accept the terms)
            this.api.post(
                this.api.getBaseUrl(),
                this.api.getEndpoints().register.participantAcceptTerms,
                {
                    urlParams: {
                        identifiers: {
                            slug: this.localState.accountHasRoleSlug
                        }
                    },
                    payload: {
                        type: 'form',
                        formKey: 'accept_terms_and_conditions_form',
                        data: {
                            accept: true
                        }
                    }
                }
            ).then(() => {

                // set state approved, so it will render the registration component
                this.localState.termsAccepted = true;
                this.setState(this.localState);
            });
        }
    }

    onChangeTermsApproval(event) {
        event.preventDefault();

        // save checkbox state and enable or disable the next button
        this.localState.approvalCheckboxChecked = event.target.checked;
        this.localState.approvalButtonDisabled = !this.localState.approvalCheckboxChecked;
        this.setState(this.localState);
    }

    render() {
        let component = null;

        const {
            accountHasRoleSlug,
            languageId,
            termsAccepted,
            isRegistered,
            showLogin,
            loginError,
            registerError,
            registerButtonDisabled,
            loginButtonDisabled,
            approvalButtonDisabled
        } = this.localState;

        // do not render when we don't have participant id or don't know the approval status
        if (!accountHasRoleSlug || !languageId) {
            return null;
        }

        // render terms component when they were not approved yet
        if (!termsAccepted) {
            component = <Terms
                i18n={ this.i18n }
                onSubmit={ this.onApproveTerms.bind(this) }
                onChange={ this.onChangeTermsApproval.bind(this) }
                buttonDisabled={ approvalButtonDisabled }
            />;

        } else if (termsAccepted && !isRegistered) {

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
