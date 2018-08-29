import { h, Component } from 'preact';

/** @jsx h */

import style from './style/login.scss';
import LoginForm from '../../../../components/LoginForm/index';

export default class Login extends Component {

    render() {
        const { onSubmit, handleChange, localState, language, username, getUsername } = this.props;

        return (
            <main className={ style.login }>
                <LoginForm
                    onSubmit={ onSubmit }
                    handleChange={ handleChange }
                    error={ localState.errors.login }
                    buttonDisabled={ localState.buttons.submitDisabled }
                    successMessage={ localState.successMessage }
                    language={ language }
                    username={ username }
                    getUsername={ getUsername }
                />
            </main>
        );
    }
}
