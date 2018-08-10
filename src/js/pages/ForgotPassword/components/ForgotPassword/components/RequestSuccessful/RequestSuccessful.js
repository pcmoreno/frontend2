import { h, Component } from 'preact';

/** @jsx h */

import style from './style/requestsuccessful.scss';

export default class RequestSuccessful extends Component {

    render() {
        const { i18n } = this.props;

        return (
            <form>
                <header className={ style.modal_header }>
                    <h3>{ i18n.login_forgot_password_email_sent_title }</h3>
                </header>
                <main className={ style.modal_main }>
                    <p dangerouslySetInnerHTML={{ __html: i18n.login_forgot_password_email_sent_description }} />
                </main>
            </form>
        );
    }
}
