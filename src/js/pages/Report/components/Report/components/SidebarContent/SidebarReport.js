import { h, Component } from 'preact';
import style from './style/report.scss';
import SelectionAdviceValues from '../../../../constants/SelectionAdviceValues';
import Utils from '../../../../../../utils/utils';
import StaticScoreValue from '../../../../constants/StaticScoreValue';
import CompetencyScoreValue from '../../../../constants/CompetencyScoreValue';

/** @jsx h */

const sidebarScorePrefix = 'sidebar_score_';

const staticScoreRegexRange = `${StaticScoreValue.MIN_VALUE}-${StaticScoreValue.MAX_VALUE}`;
const staticScoreFullRegex = new RegExp(`[^${staticScoreRegexRange}]`, 'g');

const competencyScoreRegexRange = `${CompetencyScoreValue.MIN_VALUE}-${CompetencyScoreValue.MAX_VALUE}`;
const competencyScoreFullRegex = new RegExp(`[^${competencyScoreRegexRange}]`, 'g');

export default class SidebarReport extends Component {

    constructor(props) {
        super(props);

        this.onInputStaticScore = this.onInputStaticScore.bind(this);
        this.onChangeSelectionAdvice = this.onChangeSelectionAdvice.bind(this);
        this.onInputCompetencyScore = this.onInputCompetencyScore.bind(this);
    }

    onInputStaticScore(event) {
        const value = event.target.value.replace(staticScoreFullRegex, '').slice(0, 1);

        if (value !== event.target.value) {
            event.target.value = value;
        }

        const textField = this.props.staticScores[event.target.id.replace(sidebarScorePrefix, '')];

        if (value && textField) {
            this.saveReportText(textField, value);
        }
    }

    onInputCompetencyScore(event) {
        const value = event.target.value.replace(competencyScoreFullRegex, '').slice(0, 1);

        if (value !== event.target.value) {
            event.target.value = value;
        }

        const elementFieldName = event.target.id.replace(sidebarScorePrefix, '');
        let competency = null;

        this.props.competencies.forEach(comp => {
            if (comp.name.toLowerCase() === elementFieldName) {
                competency = comp;
            }
        });

        if (competency && value) {
            this.saveCompetencyScore(competency, value);
        }
    }

    onChangeSelectionAdvice(event) {
        let approved = false;
        const value = event.target.value;

        Object.keys(SelectionAdviceValues).forEach(key => {
            if (SelectionAdviceValues[key] === value) {
                approved = true;
            }
        });

        if (approved) {
            this.saveReportText(this.props.reportTexts.selectionAdviceOutcome, value);
        }
    }

    saveReportText(textField, value) {
        this.props.saveReportText({
            slug: textField.slug,
            textFieldTemplateSlug: textField.textFieldTemplateSlug,
            name: textField.name,
            value
        }, true);
    }

    saveCompetencyScore(competency, score) {
        // console.log('save : ', competency, score);
    }

    render() {
        const { i18n, reportTexts, staticScores, competencies } = this.props;
        let selectionAdviceOptions = [];
        let selectionAdvice = null;
        let staticScoreRows = null;
        let competencyScoreRows = null;

        if (reportTexts.selectionAdviceOutcome) {
            selectionAdvice = reportTexts.selectionAdviceOutcome.value || SelectionAdviceValues.POSITIVE;

            Object.keys(SelectionAdviceValues).forEach((key, i) => {
                selectionAdviceOptions[i] = SelectionAdviceValues[key];
            });

            selectionAdviceOptions = selectionAdviceOptions.map(advice => <option
                value={ advice }
                selected={ advice === selectionAdvice }
            >
                {i18n[`report_${advice}`] || advice }
            </option>);
        }

        if (staticScores && Object.keys(staticScores).length) {
            staticScoreRows = [];

            Object.keys(staticScores).forEach(key => {
                if (staticScores.hasOwnProperty(key)) {
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
                }
            });
        }

        if (competencies && competencies.length) {
            competencyScoreRows = [];

            competencies.forEach(competency => {
                const score = Utils.parseScore(competency.score, CompetencyScoreValue.MIN_VALUE, CompetencyScoreValue.MAX_VALUE, true);

                competencyScoreRows.push(
                    <tr>
                        <td>{ i18n[competency.translationKey] || competency.name }</td>
                        <td><input
                            id={ `${sidebarScorePrefix}${competency.name.toLowerCase()}` }
                            onInput={ this.onInputCompetencyScore }
                            type='number'
                            pattern={ `[${competencyScoreRegexRange}]` }
                            min={ CompetencyScoreValue.MIN_VALUE }
                            max={ CompetencyScoreValue.MAX_VALUE }
                            value={ score || '' }
                        /></td>
                    </tr>
                );
            });
        }

        return (
            <div className={ style.sidebarReport }>
                { selectionAdvice && <section className={ style.selectionAdvice } onChange={ this.onChangeSelectionAdvice }>
                    <h4>{ i18n.report_selection_advice }</h4>
                    <select>
                        { selectionAdviceOptions }
                    </select>
                </section>}

                { competencyScoreRows && <section className={ style.staticScores }>
                    <h4>{ i18n.report_score_the_following_competencies }</h4>
                    <table>
                        { competencyScoreRows }
                    </table>
                </section>}

                { staticScoreRows && <section className={ style.staticScores }>
                    <h4>{ i18n.report_results_report_pagina }</h4>
                    <table>
                        { staticScoreRows }
                    </table>
                </section>}
            </div>
        );
    }
}
