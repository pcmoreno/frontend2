import { h, Component } from 'preact';

/** @jsx h */

import style from './style/login.scss';

export default class Login extends Component {

    render() {
        return (
            <section className={ style.login }>
                <section className="main">
                    <div className="container-fluid">
                        <div className={ style.modal }>
                            <section id="login-form">
                                <form action="" method="post" className="form-login">
                                    <div className={ style.modal }>
                                        <div className={ style.modal_dialog } role="document">
                                            <div className={ style.modal_content }>
                                                <div className={ style.modal_header }>
                                                    <h3>Log in</h3>
                                                </div>
                                                <div className={ style.modal_body }>
                                                    <ul className="list-email-label">
                                                        <li>
                                                            <label htmlFor="email">E-mailadres</label>
                                                        </li>
                                                    </ul>
                                                    <ul className="list-email">
                                                        <li>
                                                            <input tabIndex="1" type="text" id="email" name="username" value="" autoComplete="off" placeholder="E-mailadres" required />
                                                        </li>
                                                    </ul>

                                                    <ul className="list-password-label">
                                                        <li>
                                                            <label htmlFor="password">Wachtwoord</label>
                                                        </li>
                                                        <li className="right">
                                                            <input type="checkbox" id="show-password" className="show-password-input" autoComplete="off" />
                                                            <label htmlFor="show-password">show password</label>
                                                        </li>
                                                    </ul>
                                                    <ul className="list-password">
                                                        <li>
                                                            <input tabIndex="2" type="password" id="password" name="password" autoComplete="off" placeholder="Wachtwoord" required />
                                                        </li>
                                                    </ul>
                                                    <ul className="list-password-forgotten">
                                                        <li>
                                                            <a href="#" id="request-new-password-link">Wachtwoord vergeten?</a>
                                                        </li>
                                                    </ul>
                                                    <ul className={ style.list_feedback }>
                                                        <li>
                                                            <div className="feedback" id="login-message">
                                                                {/*errors go here*/}
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className={ style.modal_footer } >
                                                    <ul className={ style.list_submit }>
                                                        <li className="right">
                                                            <button className={ 'action_button' } id="login" type="submit">
                                                                Inloggen
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </section>
                        </div>
                    </div>
                </section>
            </section>
        );
    }
}
