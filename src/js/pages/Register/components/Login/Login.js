import { h, Component } from 'preact';

// todo: translate this

/** @jsx h */

import style from './style/login.scss';
import LoginForm from '../../../../components/LoginForm/components/LoginForm/LoginForm';

export default class Login extends Component {

    render() {

        const { onSubmit, onChange, error, buttonDisabled, showLogin } = this.props;

        // todo: translate text of input fields and labels
        return (
            <main className={ style.login }>
                <div className={ style.loginMargin }>
                    <section className={ style.sideLinks }>
                        <h3>Login</h3>
                        <p>I'm a new user</p>
                        <div tabIndex="0" role='button' onClick={ showLogin } className={ style.link }>
                            <span>Activate your account</span>
                        </div>
                    </section>
                    <section className={ style.loginUser }>
                        <LoginForm
                            onSubmit={ onSubmit }
                            handleChange={ onChange }
                            error = { error }
                            buttonDisabled = { buttonDisabled }
                        />
                    </section>
                </div>
            </main>
        );
    }
}
