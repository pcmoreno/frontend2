import { h, Component } from 'preact';
import style from './style/report.scss';
import SelectionAdvice from '../../../../constants/SelectionAdvice';

/** @jsx h */

export default class SidebarReport extends Component {

    render() {
        const { i18n, reportTexts } = this.props;
        let selectionAdviceOptions = [];
        let selectionAdvice = null;

        if (reportTexts.selectionAdviceOutcome) {
            selectionAdvice = reportTexts.selectionAdviceOutcome.value || SelectionAdvice.POSITIVE;

            Object.keys(SelectionAdvice).forEach((key, i) => {
                selectionAdviceOptions[i] = SelectionAdvice[key];
            });

            selectionAdviceOptions = selectionAdviceOptions.map(advice => <option
                value={ advice }
                selected={ advice === selectionAdvice }
            >
                {i18n[`report_${advice}`] || advice }
            </option>);
        }

        return (
            <div className={ style.sidebarReport }>
                { selectionAdvice && <section className={ style.selectionAdvice }>
                    <h4>{ i18n.report_selection_advice }</h4>
                    <select>
                        { selectionAdviceOptions }
                    </select>
                </section>}
            </div>
        );
    }
}
