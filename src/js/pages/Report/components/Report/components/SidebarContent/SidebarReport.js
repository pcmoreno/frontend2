import { h, Component } from 'preact';
import style from './style/report.scss';
import SelectionAdvice from '../../../../constants/SelectionAdvice';
import Utils from '../../../../../../utils/utils';
import StaticScoreValue from '../../../../constants/StaticScoreValue';

/** @jsx h */

const sidebarScorePrefix = 'sidebar_score_';
const staticScoreRegexRange = `${StaticScoreValue.MIN_VALUE}-${StaticScoreValue.MAX_VALUE}`;
const staticScoreFullRegex = new RegExp(`[^${staticScoreRegexRange}]`, 'g');

export default class SidebarReport extends Component {

    constructor(props) {
        super(props);

        this.onInputStaticScore = this.onInputStaticScore.bind(this);
    }

    onInputStaticScore(event) {
        const value = event.target.value.replace(staticScoreFullRegex, '').slice(0, 1);

        if (value !== event.target.value) {
            event.target.value = value;
        }
    }

    render() {
        const { i18n, reportTexts, staticScores } = this.props;
        let selectionAdviceOptions = [];
        let selectionAdvice = null;
        const staticScoreRows = [];

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

        if (staticScores) {
            Object.keys(staticScores).forEach(key => {
                const score = Utils.parseScore(staticScores[key].value, StaticScoreValue.MIN_VALUE, StaticScoreValue.MAX_VALUE, true);

                staticScoreRows.push(
                    <tr>
                        <td>{ i18n[`report_${Utils.camelCaseToSnakeCase(key)}`] || key}</td>
                        <td><input
                            id={ `${sidebarScorePrefix}${key}` }
                            onInput={ this.onInputStaticScore }
                            type='number'
                            pattern={ `[${staticScoreRegexRange}]` }
                            min={ StaticScoreValue.MIN_VALUE }
                            max={ StaticScoreValue.MAX_VALUE }
                            value={ score || '' }
                        /></td>
                    </tr>
                );
            });
        }

        return (
            <div className={ style.sidebarReport }>
                { selectionAdvice && <section className={ style.selectionAdvice }>
                    <h4>{ i18n.report_selection_advice }</h4>
                    <select>
                        { selectionAdviceOptions }
                    </select>
                </section>}

                { staticScores && <section className={ style.staticScores }>
                    <h4>{ i18n.report_results_report_pagina }</h4>
                    <table>
                        { staticScoreRows }
                    </table>
                </section>}
            </div>
        );
    }
}
