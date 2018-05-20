import { h, Component } from 'preact';

/** @jsx h */

import style from './style/terms.scss';

export default class Terms extends Component {

    render() {
        const { approveTerms, handleChange, buttonDisabled, i18n } = this.props;

        return (
            <section className={ style.terms }>

                <main className={ style.main }>
                    <h3>{ i18n.terms_and_conditions }</h3>

                    <p>
                        { i18n.terms_and_conditions_intro }
                    </p>

                    <section>
                        <article dangerouslySetInnerHTML={{ __html: i18n.terms_and_conditions_content }} />
                    </section>

                    <h4>{ i18n.disclaimer }</h4>
                    <p dangerouslySetInnerHTML={{ __html: i18n.disclaimer_content }} />

                </main>

                <footer className={ style.footer }>
                    <section>
                        <div>
                            <p dangerouslySetInnerHTML={{ __html: i18n.terms_and_conditions_accept_line_1 }} />
                        </div>
                        <input
                            id={'termsAndConditionsApproveCheckbox'}
                            name={'termsAndConditionsApproveCheckbox'}
                            type={'checkbox'}
                            onChange={handleChange}
                        />
                        <p>{ i18n.terms_and_conditions_accept_line_2 }</p>
                        <input
                            value={i18n.next}
                            type={'submit'}
                            className={`action_button ${style.action_button}`}
                            onClick={approveTerms}
                            disabled={ buttonDisabled }
                        />
                    </section>
                </footer>

            </section>
        );
    }
}
