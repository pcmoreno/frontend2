import { h, Component } from 'preact';

/** @jsx h */

import mainStyle from '../../style/register.scss';
import style from './style/login.scss';
import LoginForm from '../../../../components/LoginForm/index';

export default class Login extends Component {

    render() {
        const { onSubmit, onChange, error, buttonDisabled, showLogin, i18n, language } = this.props;

        return (
            <main className={ `${mainStyle.main} ${style.main}` }>
                <div className={ mainStyle.wrapper }>
                    <section className={ `${mainStyle.linkSection} ${style.linkSection}` }>
                        <h3>{ i18n.register_new_user }</h3>
                        <div tabIndex="0" role='button' onClick={ showLogin } className={ mainStyle.link }>
                            <span>{ i18n.register_activate_your_account }</span>
                        </div>
                    </section>
                    <section className={ mainStyle.formSection }>
                        <LoginForm
                            language={ language }
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
