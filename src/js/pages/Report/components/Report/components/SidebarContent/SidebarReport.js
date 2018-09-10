import { h, Component } from 'preact';
import style from './style/report.scss';
import SelectionAdviceValues from '../../../../constants/SelectionAdviceValues';
import DownloadReport from './components/DownloadReport/DownloadReport';
import Utils from '../../../../../../utils/utils';
import StaticScoreValue from '../../../../constants/StaticScoreValue';
import CompetencyScoreValue from '../../../../constants/CompetencyScoreValue';
import CompetencyProperty from '../../../../constants/CompetencyProperty';
import Authorised from '../../../../../../utils/components/Authorised';
import RetestTrigger from './components/RetestTrigger/RetestTrigger';
import ApiFactory from '../../../../../../utils/api/factory';
import ReportComponents from '../../../../constants/ReportComponents';
import ReportActions from '../../../../constants/ReportActions';

/** @jsx h */

const sidebarScorePrefix = 'sidebar_score_';
const TRANSLATION_KEY_PREFIX = 'competencies_';


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

        this.api = ApiFactory.get('neon');
    }

    componentDidMount() {
        this.isBeingCreated = [];
    }

    onInputStaticScore(event) {
        const value = event.target.value.replace(staticScoreFullRegex, '').slice(0, 1);

        // if our parsed/validated value is different, also update the text field value
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

        // if our parsed/validated value is different, also update the text field value
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
        const uniqueFieldName = `${textField.templateSlug}-${textField.name}`;

        // if there was no slug and we're already creating the entry, do not proceed
        if (this.isBeingCreated[uniqueFieldName]) {
            return;
        }

        if (!textField.slug) {
            this.isBeingCreated[uniqueFieldName] = true;
        }

        this.props.saveReportText({
            slug: textField.slug,
            templateSlug: textField.templateSlug,
            name: textField.name,
            value
        }, true).then(() => {

            // we don't need a slug from the response here upon creation,
            // the state will be updated and will update the slug in this component
            this.isBeingCreated[uniqueFieldName] = false;
        }).catch(() => {
            this.isBeingCreated[uniqueFieldName] = false;
        });
    }

    saveCompetencyScore(competency, score) {
        const uniqueFieldName = `${competency.templateSlug}-${competency.name}`;

        // if there was no slug and we're already creating the entry, do not proceed
        if (this.isBeingCreated[uniqueFieldName]) {
            return;
        }

        if (!competency.slug) {
            this.isBeingCreated[uniqueFieldName] = true;
        }

        this.props.saveCompetencyScore({
            slug: competency.slug,
            templateSlug: competency.templateSlug,
            name: competency.name,
            score
        }, true).then(() => {

            // we don't need a slug from the response here upon creation,
            // the state will be updated and will update the slug in this component
            this.isBeingCreated[uniqueFieldName] = false;
        }).catch(() => {
            this.isBeingCreated[uniqueFieldName] = false;
        });
    }

    render() {
        const { i18n, i18nOnlineReport, reportTexts, staticScores, competencies, retestButtonEnabled } = this.props;
        let selectionAdviceOptions = [];
        let selectionAdvice = null;
        let staticScoreRows = null;
        let competencyScoreRows = null;

        if (reportTexts.selectionAdviceOutcome) {
            selectionAdvice = reportTexts.selectionAdviceOutcome.value || SelectionAdviceValues.TENTATIVE;

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

            // clone, translate and sort the competencies. This does not change output values, only the order of the array
            // because the translate method will set a new field (translated_name) to store the translated value
            // instead of overwriting the original value
            const competenciesClone = competencies.slice(0);
            const translatedCompetencies = Utils.translateFieldInArray(
                competenciesClone,
                CompetencyProperty.NAME,
                CompetencyProperty.TRANSLATED_NAME,
                CompetencyProperty.TRANSLATION_KEY,
                i18nOnlineReport,
                TRANSLATION_KEY_PREFIX
            );
            const sortedCompetencies = Utils.alphabeticallySortFieldInArray(translatedCompetencies, CompetencyProperty.TRANSLATED_NAME);

            sortedCompetencies.forEach(competency => {
                const score = Utils.parseScore(competency.score, CompetencyScoreValue.MIN_VALUE, CompetencyScoreValue.MAX_VALUE, true);

                competencyScoreRows.push(
                    <tr>
                        <td>{ i18nOnlineReport[`${TRANSLATION_KEY_PREFIX}${competency.translationKey}`] || competency.name }</td>
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
                <Authorised api={ this.api } component={ ReportComponents.REPORT_COMPONENT } action={ ReportActions.RETEST_ACTION }>
                    <RetestTrigger
                        i18n={ this.props.i18n }
                        triggerRetest={ this.props.triggerRetest }
                        retestButtonEnabled={ retestButtonEnabled }
                    />
                </Authorised>
                <DownloadReport
                    i18n={ this.props.i18n }
                    generatedReport={ this.props.generatedReport }
                    generateReport={ this.props.generateReport }
                    downloadReport={ this.props.downloadReport }
                    getReportGenerationStatus={ this.props.getReportGenerationStatus }
                />

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
