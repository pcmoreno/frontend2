import { h, Component } from 'preact';

/** @jsx h */

import style from './style/login.scss';

export default class Login extends Component {
    render() {
        return (
            <section className={ style.login }>
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
                                        value=""
                                        autoComplete="off"
                                        placeholder="E-mailadres"
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
                                        required
                                    />
                                </div>
                                <span className={ style.forgot_password}>
                                    <a href="#notimplemented">Wachtwoord vergeten?</a>
                                </span>
                                <span className={ style.errors }>
                                    <div>
                                        (errors go here)
                                    </div>
                                </span>
                            </main>
                            <footer className={ style.modal_footer } >
                                <nav>
                                    <button className={ 'action_button' } type="submit">
                                        Inloggen
                                    </button>
                                </nav>
                            </footer>
                        </form>
                    </section>
                </div>
            </section>
        );
    }
}
