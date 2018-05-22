import { h, Component } from 'preact';

/** @jsx h */

import style from './style/terms.scss';

export default class Terms extends Component {

    render() {
        const { onSubmit, onChange, buttonDisabled, i18n } = this.props;

        return (
            <section className={ style.terms }>

                <main className={ style.main }>
                    <h3>{ i18n.terms_and_conditions }</h3>
                    <p dangerouslySetInnerHTML={{ __html: i18n.terms_and_conditions_intro }} />
                    <section className={ style.terms_text }>
                        <article dangerouslySetInnerHTML={{ __html: i18n.terms_and_conditions_content }} />
                    </section>
                    <h4>{ i18n.disclaimer }</h4>
                    <p dangerouslySetInnerHTML={{ __html: i18n.disclaimer_content }} />
                </main>

                <footer className={ style.footer }>
                    <section>
                        <p dangerouslySetInnerHTML={{ __html: i18n.terms_and_conditions_accept_line_1 }} />
                        <input
                            id="termsAndConditionsApproveCheckbox"
                            name="termsAndConditionsApproveCheckbox"
                            type="checkbox"
                            onChange={onChange}
                        />
                        <label htmlFor="termsAndConditionsApproveCheckbox">{ i18n.terms_and_conditions_accept_line_2 }</label>
                        <input
                            value={i18n.next}
                            type={'submit'}
                            className={ `action_button` }
                            onClick={onSubmit}
                            disabled={ buttonDisabled }
                        />
                    </section>
                </footer>

            </section>
        );
    }
}
