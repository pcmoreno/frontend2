import { h, Component } from 'preact';
import style from './style/terms.scss';

/** @jsx h */

export default class Terms extends Component {

    render() {
        const { onSubmit, onChange, buttonDisabled, i18n } = this.props;

        return (
            <section className={ style.terms }>

                <main className={ style.main }>
                    <h3>{ i18n.register_terms_and_conditions }</h3>
                    <p dangerouslySetInnerHTML={ { __html: i18n.register_terms_and_conditions_intro } } />
                    <section className={ style.terms_text }>
                        <article dangerouslySetInnerHTML={ { __html: i18n.register_terms_and_conditions_content } } />
                    </section>
                    <h4>{ i18n.register_disclaimer_label }</h4>
                    <p dangerouslySetInnerHTML={ { __html: i18n.register_disclaimer_content } } />
                </main>

                <footer className={ style.footer }>
                    <section>
                        <p dangerouslySetInnerHTML={{ __html: i18n.register_terms_and_conditions_accept_line_1 }} />
                        <input
                            id="termsAndConditionsApproveCheckbox"
                            name="termsAndConditionsApproveCheckbox"
                            type="checkbox"
                            onChange={ onChange }
                        />
                        <label htmlFor="termsAndConditionsApproveCheckbox">{ i18n.register_terms_and_conditions_accept_line_2 }</label>
                        <input
                            value={ i18n.register_terms_button_next }
                            type="submit"
                            className="action_button"
                            onClick={ onSubmit }
                            disabled={ buttonDisabled }
                        />
                    </section>
                </footer>

            </section>
        );
    }
}
