import { h, Component, render } from 'preact';
import style from './style/resetpassword.scss';
import ResetPasswordForm from './components/ResetPasswordForm/ResetPasswordForm';
import Redirect from '../../../../utils/components/Redirect';
import Logger from '../../../../utils/logger';
import AppConfig from '../../../../App.config';
import ApiFactory from '../../../../utils/api/factory';
import PersonaFitConfirm from './components/PersonaFitConfirm/PersonaFitConfirm';
import Components from '../../../../constants/Components';

/** @jsx h */

const loginEndpoint = AppConfig.api.neon.loginRedirect;
const passwordChangeSuccessful = '?passwordChangeSuccessful=true';

export default class ResetPassword extends Component {
    constructor(props) {
        super(props);

        this.onChangeInput = this.onChangeInput.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.localState = {
            tokenValidated: false,
            personaFitApp: false,
            showPersonaFitConfirm: false,
            error: '',
            input: {
                password: '',
                passwordConfirm: ''
            }
        };

        // todo: this should be removed ASAP when refactoring persona fit app integration
        if (window.location.pathname && ~window.location.pathname.indexOf('/app')) {
            this.localState.personaFitApp = true;
        }

        this.api = ApiFactory.get('neon');
    }

    onChangeInput(event) {
        this.localState.input[event.target.id] = event.target.value;
    }

    onSubmit(event) {
        event.stopPropagation();
        event.preventDefault();

        const password = this.localState.input.password;
        const passwordConfirm = this.localState.input.passwordConfirm;

        if (!password || !passwordConfirm) {
            this.localState.error = this.props.i18n.login_forgot_password_all_fields_required;
            this.setState(this.localState);
            return;
        }

        if (password !== passwordConfirm) {
            this.localState.error = this.props.i18n.login_change_password_passwords_dont_match;
            this.setState(this.localState);
            return;
        }

        this.localState.error = '';
        this.localState.submitDisabled = true;
        this.setState(this.localState);

        // request to set the new password
        this.props.submitResetPasswordRequest(
            this.props.email,
            this.props.token,
            password,
            passwordConfirm
        ).then(response => {

            if (response.errors || !response.success) {
                this.localState.error = this.props.i18n[response.errors[0]] || this.props.i18n.login_api_general_error;
                this.localState.submitDisabled = false;
                this.setState(this.localState);
            } else {

                // todo: this should be removed ASAP when refactoring persona fit app integration
                if (!this.localState.personaFitApp) {
                    render(<Redirect to={ loginEndpoint + passwordChangeSuccessful } refresh={ true }/>);
                } else {
                    this.localState.showPersonaFitConfirm = true;
                    this.setState(this.localState);
                }
            }

        }).catch(() => {
            this.localState.error = this.props.i18n.login_api_general_error;
            this.localState.submitDisabled = false;
            this.setState(this.localState);
        });
    }

    componentDidMount() {

        // check if there was a user logged in, if so, logout and refresh the page
        if (this.api.getAuthenticator().isAuthenticated()) {
            this.api.getAuthenticator().logout().then(() => {

                // logout successful, refresh this page
                render(<Redirect to={ window.location.pathname + window.location.search } refresh={ true }/>);
            }, error => {
                Logger.instance.error({
                    component: Components.FORGOT_PASSWORD,
                    message: 'Could not logout on reset password page',
                    response: error
                });
            });

            return;
        }

        this.validateToken();
    }

    validateToken() {
        this.props.validateResetToken(this.props.email, this.props.token).then(response => {

            if (response.errors || !response.valid) {
                Logger.instance.warning({
                    message: 'Password reset token is invalid',
                    component: Components.FORGOT_PASSWORD,
                    response: {
                        errors: response.errors,
                        email: this.props.email
                    }
                });
                this.redirectAway();
                return;
            }

            this.localState.tokenValidated = true;
            this.setState(this.localState);

        }).catch(() => {
            this.redirectAway();
        });
    }

    redirectAway() {

        // go to default (inbox page)
        return render(<Redirect to={'/'} refresh={true}/>);
    }

    render() {
        const { i18n } = this.props;
        let component = null;

        if (!this.localState.tokenValidated) {
            return null;
        }

        if (this.localState.showPersonaFitConfirm) {
            component = <PersonaFitConfirm
                i18n={ i18n }
            />;
        } else {
            component = <ResetPasswordForm
                i18n={ i18n }
                onChangeInput={ this.onChangeInput }
                onSubmit={ this.onSubmit }
                submitDisabled={ this.localState.submitDisabled }
                error={ this.localState.error }
            />;
        }

        // todo: this should be removed ASAP when refactoring persona fit app integration
        return (
            <main className={ `${style.resetpassword} ${this.localState.personaFitApp ? style.personaFitApp : ''}` }>
                <div className={ style.modal }>
                    <section className={ style.margin }>
                        { component }
                    </section>
                </div>
            </main>
        );
    }
}
