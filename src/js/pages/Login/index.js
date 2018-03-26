import { h, Component, render } from 'preact';
import ApiFactory from '../../utils/api/factory';

/** @jsx h */

import Login from './components/Login/Login';
import Redirect from "../Redirect";

export default class Index extends Component {
    constructor(props) {
        super(props);

        this.redirectPath = this.props.redirectPath;
        this.inputValues = {};

        this.submitLogin = this.submitLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.localState = {
            submitDisabled: false,
            error: 'f1'
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

            // disable button
            newState.submitDisabled = true;

            // todo: show a loader (set new state!)

            const api = ApiFactory.get('neon');
            const username = this.inputValues.email;
            const password = this.inputValues.password;

            api.getAuthenticator().authenticate({
                username,
                password
            }).then((/* user */) => {

                render(<Redirect path={ this.redirectPath }/>);
            }).catch((/* error */) => {

                console.log('here error');
                this.setErrorMessage();
                // todo: translate message
                newState.error = 'Inloggen mislukt. Probeer opnieuw.';
                newState.submitDisabled = false;

                // set state (async)
                this.setState(newState);
            });

        } else {

            // todo: translate message
            newState.error = 'Voer a.u.b. de verplichte velden in.';
        }

        // todo: changing the state here does not work!
        // always set the new state
        this.setState(newState);
    }

    setErrorMessage(error) {
        console.log('');
        this.setState({
            error: 'errorrr'
        });
    }

    componentDidMount() {
        window.setTimeout(() => {
            console.log('call set state');
            console.log(this.localState.error);
            this.setState({
                localState: {error: 'errorrr'}
            });
        }, 5000);
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
