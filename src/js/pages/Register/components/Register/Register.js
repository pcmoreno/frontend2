import { h, Component } from 'preact';

// todo: translate this

/** @jsx h */

import style from './style/register.scss';

export default class Register extends Component {

    render() {

        const { onSubmit, onChange, error, buttonDisabled } = this.props;

        // todo: translate text of input fields and labels
        return (
            <main className={ style.register }>
                <div className={ style.registerMargin }>
                    <section className={ style.newUser }>
                        <form>
                            <header className={ style.modalHeader }>
                                <h3>I'm a new user</h3>
                            </header>
                            <main>
                                <div className={style.inputContainer}>
                                    <label htmlFor="email">Your e-mail address</label>
                                    <input
                                        tabIndex="1"
                                        type="text"
                                        id="email"
                                        name="username"
                                        autocomplete="off"
                                        placeholder="E-mailadres"
                                        onChange={onChange}
                                        required
                                    />
                                </div>
                                <div className={style.inputContainer}>
                                    <label htmlFor="password">New password</label>
                                    <input
                                        tabIndex="2"
                                        type="password"
                                        id="password"
                                        name="password"
                                        autocomplete="off"
                                        placeholder="Wachtwoord"
                                        onChange={onChange}
                                        required
                                    />
                                </div>
                                <div className={style.inputContainer}>
                                    <label htmlFor="passwordConfirm">Confirm password</label>
                                    <input
                                        tabIndex="3"
                                        type="password"
                                        id="passwordConfirm"
                                        name="passwordConfirm"
                                        autocomplete="off"
                                        placeholder="Confirm password"
                                        onChange={onChange}
                                        required
                                    />
                                </div>
                                <span className={ style.errors }>
                                    { error }
                                </span>
                            </main>
                            <footer className={style.modalFooter}>
                                <nav>
                                    <button tabIndex="4" className={ 'action_button' } disabled={ buttonDisabled } onClick={ onSubmit }>
                                    Create account
                                    </button>
                                </nav>
                            </footer>
                        </form>
                    </section>
                    <section className={ style.sideLinks }>
                        <h3>Login</h3>
                        <p>Already a registered user?</p>
                        <p className={ style.link}>
                            <a href="#notimplemented">Login</a>
                        </p>
                        <p className={ style.link}>
                            <a href="#notimplemented">I forgot my password</a>
                        </p>
                    </section>
                </div>
            </main>
        );
    }
}
