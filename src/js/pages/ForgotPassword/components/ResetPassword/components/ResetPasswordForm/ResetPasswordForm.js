import { h, Component } from 'preact';

/** @jsx h */

import style from './style/resetpasswordform.scss';

export default class ResetPasswordForm extends Component {

    render() {
        const { i18n, onChangeInput, onSubmit, submitDisabled, error } = this.props;

        return (
            <form>
                <header className={ style.modal_header }>
                    <h3>{ i18n.login_change_password_title }</h3>
                </header>
                <main className={ style.modal_main }>
                    <div>
                        <label htmlFor="password">{ `${i18n.login_change_password_new_password} *` }</label>
                        <input
                            tabIndex="1"
                            type="password"
                            id="password"
                            name="password"
                            autocomplete="new-password"
                            onChange={ onChangeInput }
                            required
                        />
                        <label htmlFor="passwordConfirm">{ `${i18n.login_change_password_new_password_confirm} *` }</label>
                        <input
                            tabIndex="2"
                            type="password"
                            id="passwordConfirm"
                            name="passwordConfirm"
                            autocomplete="new-password"
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
                            { i18n.login_change_password_confirm }
                        </button>
                    </nav>
                </footer>
            </form>
        );
    }
}
