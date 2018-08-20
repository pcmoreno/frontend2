import { h, Component, render } from 'preact';

/** @jsx h */

import style from './style/personafitconfirm.scss';
import Utils from '../../../../../../utils/utils';

export default class PersonaFitConfirm extends Component {
    render() {
        const { i18n } = this.props;
        const mobileOS = Utils.getMobileOperatingSystem();
        let appStoreUrl = '';

        // todo: these urls should be replaced with direct links with a custom protocol
        switch (mobileOS) {
            case Utils.MobileOS.ANDROID:
                appStoreUrl = 'https://play.google.com/store/apps/details?id=com.ltp.personafit';
                break;
            case Utils.MobileOS.IOS:
                appStoreUrl = 'https://itunes.apple.com/nl/app/persona-fit/id1348253016?mt=8';
                break;
            default: break;
        }

        // todo: this should be removed ASAP when refactoring persona fit app integration
        return (
            <form>
                <header className={ style.modal_header }>
                    <h3>{ i18n.login_forgot_password_confirm_title }</h3>
                </header>
                <main className={ style.modal_main }>
                    <p>{ i18n.login_forgot_password_return_to_persona_fit_app_desktop }</p>
                    { appStoreUrl &&
                        <p>
                            <a href={ appStoreUrl }>{ i18n.login_forgot_password_return_to_persona_fit_app_mobile} </a>
                        </p>
                    }
                </main>
            </form>
        );
    }
}
