import { h, Component } from 'preact';

/** @jsx h */

import style from './style/terms.scss';

export default class Terms extends Component {

    render() {
        const { onSubmit, onChange, buttonDisabled, i18n } = this.props;

        return (
            <section className={ style.terms }>
                Terms component!
                todo: implement the text component for terms and conditions
                <div />
                <div class={style.footer}>
                    <div class={style.footerControls}>
                        <div
                            dangerouslySetInnerHTML={i18n.terms_and_conditions_accept_line_1}
                        />
                        <input
                            id={'termsAndConditionsApproveCheckbox'}
                            name={'termsAndConditionsApproveCheckbox'}
                            type={'checkbox'}
                            onChange={onChange}
                        />
                        {i18n.terms_and_conditions_accept_line_2}
                        <input
                            value={i18n.next}
                            type={'submit'}
                            className={`action_button ${style.action_button}`}
                            onClick={onSubmit}
                            disabled={ buttonDisabled }
                        />
                    </div>
                </div>
            </section>
        );
    }
}
