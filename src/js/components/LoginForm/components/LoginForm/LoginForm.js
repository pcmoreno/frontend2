import { h, Component } from 'preact';

// todo: translate this

/** @jsx h */

import style from './style/loginform.scss';

export default class LoginForm extends Component {

    render() {
        const { onSubmit, handleChange, localState } = this.props;

        // todo: translate text of input fields and labels
        return (
            <div className={ style.modal }>
                <section className={ style.loginMargin }>
                    <form>
                        <header className={ style.modal_header }>
                            <h3>Log in</h3>
                        </header>
                        <main>
                            <div>
                                <label htmlFor="email">E-mailadres</label>
                                <input
                                    tabIndex="1"
                                    type="text"
                                    id="email"
                                    name="username"
                                    autoComplete="off"
                                    placeholder="E-mailadres"
                                    onChange={ handleChange }
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password">Wachtwoord</label>
                                <input
                                    tabIndex="2"
                                    type="password"
                                    id="password"
                                    name="password"
                                    autoComplete="off"
                                    placeholder="Wachtwoord"
                                    onChange={ handleChange }
                                    required
                                />
                            </div>
                            <span className={ style.forgot_password}>
                                <a href="#notimplemented">Wachtwoord vergeten?</a>
                            </span>
                            <span className={ style.errors }>
                                { localState.errors.login }
                            </span>
                        </main>
                        <footer className={ style.modal_footer } >
                            <nav>
                                <button className={ 'action_button' } disabled={ localState.buttons.submitDisabled } onClick={ onSubmit }>
                                    Inloggen
                                </button>
                            </nav>
                        </footer>
                    </form>
                </section>
            </div>
        );
    }
}
