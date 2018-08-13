import { h, Component } from 'preact';

/** @jsx h */

import style from './style/forgotpassword.scss';
import RequestPasswordForm from './components/RequestPasswordForm/RequestPasswordForm';
import RequestSuccessful from './components/RequestSuccessful/RequestSuccessful';

export default class ForgotPassword extends Component {

    constructor(props) {
        super(props);

        this.onChangeInput = this.onChangeInput.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.localState = {
            submitDisabled: false,
            requestSuccessful: false,
            error: '',
            username: ''
        };
    }

    onChangeInput(event) {
        this.localState.username = event.target.value;
    }

    onSubmit(event) {
        event.stopPropagation();
        event.preventDefault();

        // validate input
        if (!this.localState.username) {
            this.localState.error = this.props.i18n.login_forgot_password_all_fields_required;
            this.setState(this.localState);
            return;
        }

        this.localState.submitDisabled = true;
        this.setState(this.localState);

        // request email
        this.props.submitForgotPasswordRequest(this.localState.username).then(response => {

            if (response.errors) {
                this.localState.error = this.props.i18n[response.errors[0]] || this.props.i18n.login_api_general_error;
            } else {
                this.localState.requestSuccessful = true;
            }

            this.localState.submitDisabled = false;
            this.setState(this.localState);

        }).catch(() => {
            this.localState.error = this.props.i18n.login_api_general_error;
            this.localState.submitDisabled = false;
            this.setState(this.localState);
        });
    }

    render() {
        const { i18n } = this.props;
        let content = null;

        if (!this.localState.requestSuccessful) {

            // render request form
            content = <RequestPasswordForm
                i18n={ i18n }
                onChangeInput={ this.onChangeInput }
                onSubmit={ this.onSubmit }
                submitDisabled={ this.localState.submitDisabled }
                error={ this.localState.error }
            />;
        } else {

            // render request successful component
            content = <RequestSuccessful
                i18n={ i18n }
            />;
        }

        return (
            <main className={ style.forgotpassword }>
                <div className={ style.modal }>
                    <section className={ style.margin }>
                        { content }
                    </section>
                </div>
            </main>
        );
    }
}
