import { h, Component, render } from 'preact';
import ApiFactory from '../../utils/api/factory';

/** @jsx h */

import Login from './components/Login/Login';
import Redirect from '../../utils/components/Redirect';
import RedirectHelper from '../../utils/redirectHelper';

export default class Index extends Component {
    constructor(props) {
        super(props);

        this.inputValues = {};

        this.submitLogin = this.submitLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.localState = {
            buttons: {
                submitDisabled: false
            },
            errors: {
                login: ''
            }
        };
    }

    componentWillMount() {
        const api = ApiFactory.get('neon');

        if (api.getAuthenticator().isAuthenticated()) {
            render(<Redirect to={'/'}/>);
        }
    }

    handleChange(event) {
        event.preventDefault();

        // store changed values
        this.inputValues[event.currentTarget.id] = event.currentTarget.value;
    }

    submitLogin(event) {
        event.preventDefault();

        const newState = Object.assign({}, this.localState);

        // reset error on the login page
        newState.errors.login = '';

        if (this.inputValues.email && this.inputValues.password) {

            // disable button
            newState.buttons.submitDisabled = true;

            const api = ApiFactory.get('neon');
            const username = this.inputValues.email;
            const password = this.inputValues.password;

            api.getAuthenticator().authenticate({
                username,
                password
            }).then((/* user */) => {

                // to avoid possible issues when routing in the same session to login page, enable the button
                newState.buttons.submitDisabled = false;

                render(<Redirect to={RedirectHelper.instance.getRedirectPath()} refresh={'true'}/>);

            }).catch((/* error */) => {

                // todo: translate message
                newState.errors.login = 'Inloggen mislukt. Probeer het opnieuw.';
                newState.buttons.submitDisabled = false;

                // set state (async)
                this.setState(newState);
            });

        } else {

            // todo: translate message
            newState.errors.login = 'Voer a.u.b. de verplichte velden in.';
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
            />
        );
    }
}
