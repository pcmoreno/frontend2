import { h, Component } from 'preact';

// todo: translate this

/** @jsx h */

import mainStyle from '../../style/register.scss';
import style from './style/login.scss';
import LoginForm from '../../../../components/LoginForm/components/LoginForm/LoginForm';

export default class Login extends Component {

    render() {

        const { onSubmit, onChange, error, buttonDisabled, showLogin } = this.props;

        // todo: translate text of input fields and labels
        return (
            <main className={ `${mainStyle.main} ${style.main}` }>
                <div className={ mainStyle.wrapper }>
                    <section className={ `${mainStyle.linkSection} ${style.linkSection}` }>
                        <h3>I'm a new user</h3>
                        <div tabIndex="0" role='button' onClick={ showLogin } className={ mainStyle.link }>
                            <span>Activate your account</span>
                        </div>
                    </section>
                    <section className={ mainStyle.formSection }>
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
