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

export default class Report extends Component {

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

        const { report, saveReportText, i18n } = this.props;

        // don't render without a report
        if (!report || !report.isLoaded) {
            return null;
        }

        // define sidebar tabs
        const tabs = [
            {
                name: i18n.report,
                icon: ['far', 'file-alt'],
                component: <div />
            },
            {
                name: i18n.participant,
                icon: 'user',
                component: <div />
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
                            selectionAdvice: report.texts.selectionAdvice
                        }}
                        i18n={i18n}
                        saveReportText={saveReportText}
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

                </section>

                <Sidebar tabs={ tabs } i18n={i18n} />

            </main>
        );
    }
}
