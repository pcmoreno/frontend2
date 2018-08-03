import { h, Component } from 'preact';

/** @jsx h */

import style from './style/report.scss';
import Header from './components/Header/Header';
import Sidebar from './../../../../components/Sidebar';
import Introduction from './components/Introduction/Introduction';
import Utils from '../../../../utils/utils';
import AppConfig from '../../../../App.config';
import ResearchQuestion from './components/ResearchQuestion/ResearchQuestion';
import SelectionAdvice from './components/SelectionAdvice/SelectionAdvice';
import Explanation from './components/Explanation/Explanation';
import DevelopmentAdvice from './components/DevelopmentAdvice/DevelopmentAdvice';
import Authorised from '../../../../utils/components/Authorised';
import ReportActions from '../../constants/ReportActions';
import ApiFactory from '../../../../utils/api/factory';
import ReportComponents from '../../constants/ReportComponents';
import CompetencyProfile from './components/CompetencyProfile/CompetencyProfile';
import IntellectualCapabilities from './components/Attachment/IntellectualCapabilities/IntellectualCapabilities';
import Personality from './components/Attachment/Personality/Personality';
import Motives from './components/Attachment/Motives/Motives';
import InfluencingStyles from './components/Attachment/InfluencingStyles/InfluencingStyles';
import WorkingStyles from './components/Attachment/WorkingStyles/WorkingStyles';
import SidebarReport from './components/SidebarContent/SidebarReport';
import SidebarParticipant from './components/SidebarContent/SidebarParticipant';

export default class Report extends Component {

    constructor() {
        super();

        this.api = ApiFactory.get('neon');
    }

    componentWillMount() {
        this.loadExternalEditorScripts();
    }

    loadExternalEditorScripts() {

        // load external scripts if they were not set
        // in this case, all external scripts should be loaded in the right order.
        if (!window.$ || !window.jQuery) {
            Utils.loadExternalScript(AppConfig.sources.jquery).then(() => {
                this.loadFroalaEditor();
            });

        } else {
            this.loadFroalaEditor();
        }
    }

    loadFroalaEditor() {
        if (!window.froalaLoaded) {
            Utils.loadExternalScript(AppConfig.sources.froala).then(() => {
                window.froalaLoaded = true;
                window.$.FroalaEditor.DEFAULTS.key = `${process.env.FROALA_KEY}`;
                this.loadFroalaEditorPlugins();
            });
        } else {
            this.loadFroalaEditorPlugins();
        }
    }

    loadFroalaEditorPlugins() {
        if (!window.froalaParagraphPluginLoaded) {
            Utils.loadExternalScript(AppConfig.sources.froalaParagraphPlugin).then(() => {
                window.froalaParagraphPluginLoaded = true;
            });
        }

        if (!window.froalaListPluginLoaded) {
            Utils.loadExternalScript(AppConfig.sources.froalaListPlugin).then(() => {
                window.froalaListPluginLoaded = true;
            });
        }
    }

    componentDidUpdate() {

        // attempt to hide the sidebar on small screens by default. not sure if componentdidupdate is the right place
        if (window.innerWidth < 640 && document.querySelector('#page_with_sidebar')) {
            document.querySelector('#page_with_sidebar').classList.remove('full_width_sidebar');
        }
    }

    render() {

        // todo: titles of blocks/sections should be translated

        const { report, saveReportText, i18n, languageId } = this.props;

        // don't render without a report
        if (!report || !report.isLoaded) {
            return null;
        }

        const staticScores = {
            intellectualCapabilities: report.texts.intelligenceScore,
            powerToChangeScore: report.texts.powerToChangeScore
        };

        // define sidebar tabs
        const tabs = [
            {
                name: i18n.report_report,
                icon: ['far', 'file-alt'],
                component: <SidebarReport
                    i18n={ i18n }
                    reportTexts={ report.texts }
                    staticScores={ staticScores }
                />
            },
            {
                name: i18n.report_participant,
                icon: 'user',
                component: <SidebarParticipant
                    i18n={ i18n }
                />
            }
        ];

        // note: some fields may depend on the report/product type. textFields_textsTemplates dictates which fields
        // should be on a report type/product/template when there is no text available on the report, and the template
        // does not require this field, they are ignored in the rendering process automatically

        return (
            <main className={ `${style.report} full_width_sidebar` } id="page_with_sidebar">

                <section className={style.page_with_sidebar_container} id="page_with_sidebar_container">

                    <Header
                        participant={report.participant}
                        product={report.product}
                        organisation={report.organisation}
                        consultant={report.consultant}
                        i18n={i18n}
                    />

                    <Introduction
                        texts={{
                            goal: report.texts.goal,
                            validity: report.texts.validity,
                            parts: report.texts.parts,
                            structure: report.texts.structure
                        }}
                        i18n={i18n}
                        saveReportText={saveReportText}
                    />

                    <ResearchQuestion
                        texts={{
                            researchQuestion: report.texts.enquiry
                        }}
                        i18n={i18n}
                        saveReportText={saveReportText}
                    />
                    {/* Selection advice is only shown if this was written on this report or when this field was attached to this template/product */}
                    {/* in textFields_textTemplates */}
                    <SelectionAdvice
                        texts={{
                            selectionAdvice: report.texts.selectionAdvice,
                            selectionAdviceOutcome: report.texts.selectionAdviceOutcome
                        }}
                        i18n={i18n}
                        saveReportText={saveReportText}
                    />

                    {/* The competency profile and its child widgets (Intelligence and Competencies) should only render when they are available */}
                    <CompetencyProfile
                        i18n={i18n}
                        educationLevel={report.participant.educationLevel}
                        staticScores= { staticScores }
                        competencies={ report.competencies }
                        languageId={ languageId }
                    />

                    <Explanation
                        texts={{
                            strongPoints: report.texts.strongPoints,
                            pointsOfAttention: report.texts.pointsOfAttention
                        }}
                        i18n={i18n}
                        saveReportText={saveReportText}
                    />

                    {/* Development advice is only shown if this was written on this report or when this field was attached to this template/product */}
                    {/* in textFields_textTemplates */}
                    <DevelopmentAdvice
                        texts={{
                            developmentAdvice: report.texts.developmentAdvice
                        }}
                        i18n={i18n}
                        saveReportText={saveReportText}
                    />

                    { /* should always be visible, but the scorebar may be empty if the API didnt return them */ }
                    <IntellectualCapabilities
                        i18n={i18n}
                        hnaCategoryScores={report.hnaCategoryScores}
                    />

                    <Personality
                        i18n={i18n}
                        hnaCategoryScores={report.hnaCategoryScores}
                    />

                    <Motives
                        i18n={i18n}
                        hnaCategoryScores={report.hnaCategoryScores}
                    />

                    <InfluencingStyles
                        i18n={i18n}
                        hnaCategoryScores={report.hnaCategoryScores}
                    />

                    <WorkingStyles
                        i18n={i18n}
                        hnaCategoryScores={report.hnaCategoryScores}
                    />

                </section>

                <Authorised api={ this.api } component={ ReportComponents.REPORT_COMPONENT } action={ ReportActions.WRITE_ACTION }>
                    <Sidebar tabs={ tabs } i18n={i18n} />
                </Authorised>

            </main>
        );
    }
}
