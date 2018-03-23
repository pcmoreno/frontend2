import { h, Component } from 'preact';
import ApiFactory from '../../utils/api/factory';

/** @jsx h */

import Login from './components/Login/Login';

export default class Index extends Component {
    constructor(props) {
        super(props);

        this.redirectPath = this.props.redirectPath;
        this.inputValues = {};

        this.submitLogin = this.submitLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.localState = {
            submitDisabled: false,
            error: 'f'
        };
    }

    handleChange(event) {
        event.preventDefault();

        // store changed values
        this.inputValues[event.currentTarget.id] = event.currentTarget.value;
    }

    submitLogin(event) {
        event.preventDefault();

        const newState = Object.assign({}, this.localState);

        if (this.inputValues.email && this.inputValues.password) {

            const api = ApiFactory.get('neon');
            const username = this.inputValues.email;
            const password = this.inputValues.password;

            api.getAuthenticator().authenticate({
                username,
                password
            }).then(user => {

            }).catch(error => {
            });

        } else {

            // todo: translate message
            newState.error = 'Voer a.u.b. de verplichte velden in.';
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
