import { h, Component } from 'preact';

/** @jsx h */

import mainStyle from '../../style/register.scss';
import style from './style/register.scss';

export default class Register extends Component {

    render() {
        const { onSubmit, onChange, error, buttonDisabled, showLogin, i18n } = this.props;

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
                                    <label htmlFor="username">{ i18n.register_email_label }</label>
                                    <input
                                        tabIndex="1"
                                        type="text"
                                        id="username"
                                        name="username"
                                        autocomplete="off"
                                        placeholder={ i18n.register_email_placeholder }
                                        onChange={onChange}
                                        required
                                    />
                                </div>
                                <div className={style.inputContainer}>
                                    <label htmlFor="password">{ i18n.register_new_password_label }</label>
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
                                    <label htmlFor="passwordConfirm">{ i18n.register_confirm_password_label }</label>
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
                            <a href="#notimplemented">{ i18n.register_forgot_my_password_label }</a>
                        </p>
                    </section>
                </div>
            </main>
        );
    }
}
