import { h, Component } from 'preact';

/** @jsx h */

import style from './style/requestpasswordform.scss';

export default class RequestPasswordForm extends Component {

    render() {
        const { i18n, onChangeInput, onSubmit, submitDisabled, error } = this.props;

        return (
            <form>
                <header className={ style.modal_header }>
                    <h3>{ i18n.login_forgot_password_title }</h3>
                    <p>{ i18n.login_forgot_password_description }</p>
                </header>
                <main className={ style.modal_main }>
                    <div>
                        <label htmlFor="email">{ i18n.login_forgot_password_email }</label>
                        <input
                            tabIndex="1"
                            type="text"
                            id="username"
                            name="username"
                            autocomplete="on"
                            placeholder={ i18n.login_forgot_password_email_placeholder }
                            onChange={ onChangeInput }
                            required
                        />
                    </div>
                    <span className={ style.errors }>
                        { error }
                    </span>
                </main>
                <footer className={ style.modal_footer }>
                    <nav>
                        <button className='action_button' disabled={ submitDisabled } onClick={ onSubmit }>
                            { i18n.login_forgot_password_send }
                        </button>
                    </nav>
                </footer>
            </form>
        );
    }
}
