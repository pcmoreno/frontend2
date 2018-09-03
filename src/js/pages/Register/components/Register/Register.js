import { h, Component, render } from 'preact';

/** @jsx h */

import mainStyle from '../../style/register.scss';
import style from './style/register.scss';
import AppConfig from '../../../../App.config';
import Redirect from '../../../../utils/components/Redirect';

export default class Register extends Component {
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
        const { onSubmit, onChange, error, buttonDisabled, showLogin, i18n, emailInput } = this.props;

        return (
            <main className={ `${mainStyle.main} ${style.main}` }>
                <div className={ mainStyle.wrapper }>
                    <section className={ mainStyle.formSection }>
                        <form>
                            <header className={ style.modalHeader }>
                                <h3>{ i18n.register_new_user }</h3>
                            </header>
                            <main>
                                <div className={style.inputContainer}>
                                    <label htmlFor="username">{ `${i18n.register_email_label} *` }</label>
                                    <input
                                        tabIndex="1"
                                        type="text"
                                        id="username"
                                        name="username"
                                        autocomplete="off"
                                        placeholder={ i18n.register_email_placeholder }
                                        onChange={onChange}
                                        value={ emailInput }
                                        required
                                    />
                                </div>
                                <div className={style.inputContainer}>
                                    <label htmlFor="password">{ `${i18n.register_new_password_label} *` }</label>
                                    <input
                                        tabIndex="2"
                                        type="password"
                                        id="password"
                                        name="password"
                                        autocomplete="off"
                                        placeholder={ i18n.register_new_password_placeholder }
                                        onChange={onChange}
                                        required
                                    />
                                </div>
                                <div className={style.inputContainer}>
                                    <label htmlFor="passwordConfirm">{ `${i18n.register_confirm_password_label} *` }</label>
                                    <input
                                        tabIndex="3"
                                        type="password"
                                        id="passwordConfirm"
                                        name="passwordConfirm"
                                        autocomplete="off"
                                        placeholder={ i18n.register_confirm_password_placeholder }
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
                                        { i18n.register_create_account_button_label }
                                    </button>
                                </nav>
                            </footer>
                        </form>
                    </section>
                    <section className={ `${mainStyle.linkSection} ${style.linkSection}` }>
                        <h3>{ i18n.register_login_label }</h3>
                        <p>{ i18n.register_already_registered_label }</p>
                        <div tabIndex="5" role='button' onClick={ showLogin } className={ mainStyle.link }>
                            <span>{ i18n.register_login_label }</span>
                        </div>
                        <p className={ mainStyle.link}>
                            <span role="link"
                                tabIndex="0"
                                onClick={() => {
                                    this.forgotPasswordHandler();
                                }}>{i18n.register_forgot_my_password_label}
                            </span>
                        </p>
                    </section>
                </div>
            </main>
        );
    }
}
