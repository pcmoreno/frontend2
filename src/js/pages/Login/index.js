import { h, Component, render } from 'preact';
import ApiFactory from '../../utils/api/factory';

/** @jsx h */

import Login from './components/Login/Login';
import Redirect from '../../utils/components/Redirect';
import RedirectHelper from '../../utils/redirectHelper';
import translator from '../../utils/translator';
import Utils from '../../utils/utils';
import AppConfig from '../../App.config';

const successTimeout = 5000;

export default class Index extends Component {
    constructor(props) {
        super(props);

        this.inputValues = {
            username: '',
            password: ''
        };

        this.submitLogin = this.submitLogin.bind(this);
        this.getUsername = this.getUsername.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.localState = {
            buttons: {
                submitDisabled: false
            },
            errors: {
                login: ''
            },
            successMessage: ''
        };

        // get browser language to determine the translations
        const languageConfig = AppConfig.languages;
        const language = Utils.getBrowserLanguage(
            languageConfig.supported,
            languageConfig.defaultLanguage,
            languageConfig.mapped
        );

        this.i18n = translator(language, 'login');
        this.language = language;
    }

    componentWillMount() {
        const api = ApiFactory.get('neon');

        if (api.getAuthenticator().isAuthenticated()) {
            render(<Redirect to={'/'} refresh={true} />);
        }
    }

    componentDidMount() {

        // user was just registered, show a message
        if (this.props.matches && this.props.matches.registrationSuccess) {
            this.localState.successMessage = this.i18n.login_registration_successful;
            this.setState(this.localState);
        } else if (this.props.matches && this.props.matches.passwordChangeSuccessful) {
            this.localState.successMessage = this.i18n.login_password_change_successful;
            this.setState(this.localState);
        }

        // todo: this is messing with already filled in login data, it will clear the input fields in the form. fix!
        this.timeout = window.setTimeout(() => {

            // hide message
            this.localState.successMessage = '';
            this.setState(this.localState);

            // clear and delete everything
            window.clearTimeout(this.timeout);
            this.timeout = null;
            delete this.timeout;
        }, successTimeout);
    }

    handleChange(event) {
        event.preventDefault();

        // store changed values
        this.inputValues[event.currentTarget.id] = event.currentTarget.value;
    }

    getUsername() {
        return this.inputValues.username;
    }

    submitLogin(event) {
        event.preventDefault();

        const newState = Object.assign({}, this.localState);

        // reset error on the login page
        newState.errors.login = '';

        if (this.inputValues.username && this.inputValues.password) {

            // disable button
            newState.buttons.submitDisabled = true;

            const api = ApiFactory.get('neon');
            const username = this.inputValues.username;
            const password = this.inputValues.password;

            api.getAuthenticator().authenticate({
                username,
                password
            }).then((/* user */) => {

                // to avoid possible issues when routing in the same session to login page, enable the button
                newState.buttons.submitDisabled = false;

                // set redirect path to index by default when there was no previous redirect path set
                if (!RedirectHelper.instance.getRedirectPath()) {
                    RedirectHelper.instance.setRedirectPath('/');
                }

                render(<Redirect to={RedirectHelper.instance.getRedirectPath()} refresh={true}/>);

            }).catch((/* error */) => {
                newState.errors.login = this.i18n.login_login_failed;
                newState.buttons.submitDisabled = false;

                // set state (async)
                this.setState(newState);
            });

        } else {

            /* todo: I prefer including i18n here and passing it on to the loginForm component, is that possible? */
            newState.errors.login = this.i18n.login_all_fields_required;
        }

        // always set the new state
        this.setState(newState);
    }

    render() {
        return (
            <Login
                onSubmit={ this.submitLogin }
                handleChange={ this.handleChange }
                localState={ this.localState }
                language = { this.language }
                username={ this.inputValues.username }
                getUsername = { this.getUsername }
            />
        );
    }
}
