import { h, Component, render } from 'preact';

/** @jsx h */

import style from './style/loginform.scss';
import AppConfig from '../../../../App.config';
import Redirect from '../../../../utils/components/Redirect';

export default class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.forgotPasswordHandler = this.forgotPasswordHandler.bind(this);
    }

    forgotPasswordHandler() {

        // since user can overwrite the pre-filled in username (email), pass on the form field
        // value directly to the password forget function

        let amendedUsername;

        if (document.querySelector('#username')) {
            amendedUsername = `?username=${document.querySelector('#username').value}`;
        }

        render(<Redirect to={ `${AppConfig.global.forgotPasswordUrl}${amendedUsername}` } refresh={ true }/>);
    }

    render() {
        const { onSubmit, handleChange, error, buttonDisabled, successMessage, i18n, username } = this.props;

        return (
            <div className={ style.modal }>
                <section className={ style.loginMargin }>
                    <form>
                        <header className={ style.modal_header }>
                            <h3>{ i18n.login_login_label }</h3>
                            <p className={style.successMessage}> {successMessage} </p>
                        </header>
                        <main>
                            <div>
                                <label htmlFor="email">{ i18n.login_email_label }</label>
                                <input
                                    tabIndex="1"
                                    type="text"
                                    id="username"
                                    name="username"
                                    autoComplete="on"
                                    placeholder={ i18n.login_email_placeholder }
                                    onChange={ handleChange }
                                    value={ username || '' }
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password">{ i18n.login_password_label }</label>
                                <input
                                    tabIndex="2"
                                    type="password"
                                    id="password"
                                    name="password"
                                    autoComplete="off"
                                    placeholder= { i18n.login_password_placeholder }
                                    onChange={ handleChange }
                                    required
                                />
                            </div>
                            <span className={ style.link }>
                                <span role="link"
                                    tabIndex="0"
                                    onClick={() => {
                                        this.forgotPasswordHandler();
                                    }}>{i18n.login_forgot_password}
                                </span>
                            </span>
                            <span className={ style.errors }>
                                { error }
                            </span>
                        </main>
                        <footer className={ style.modal_footer } >
                            <nav>
                                <button className={ 'action_button' } disabled={ buttonDisabled } onClick={ onSubmit }>
                                    { i18n.login_login_button_label }
                                </button>
                            </nav>
                        </footer>
                    </form>
                </section>
            </div>
        );
    }
}
