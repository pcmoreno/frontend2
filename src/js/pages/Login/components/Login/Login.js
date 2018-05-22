import { h, Component } from 'preact';

// todo: translate this

/** @jsx h */

import style from './style/login.scss';
import LoginForm from '../../../../components/LoginForm/components/LoginForm/LoginForm';

export default class Login extends Component {

    render() {
        const { onSubmit, handleChange, localState, successMessage } = this.props;

        return (
            <main className={ style.login }>
                <LoginForm
                    onSubmit={ onSubmit }
                    handleChange={ handleChange }
                    error={ localState.errors.login }
                    buttonDisabled={ localState.buttons.submitDisabled }
                    successMessage={ localState.successMessage }
                />
            </main>
        );
    }
}
