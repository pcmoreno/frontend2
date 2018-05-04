import { h, Component } from 'preact';

/** @jsx h */

import style from './style/report.scss';
import Header from './components/Header/Header';
import Sidebar from './../../../../components/Sidebar';
import Introduction from './components/Introduction/Introduction';
import Utils from '../../../../utils/utils';
import AppConfig from '../../../../App.config';

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
                window.$.FroalaEditor.DEFAULTS.key = AppConfig.sources.froalaKey;
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

        const { report, saveReportText } = this.props;

        // don't render without a report
        if (!report || !report.isLoaded) {
            return null;
        }

        // define sidebar tabs
        const tabs = [
            {
                name: 'Rapport', // todo: translate this label
                icon: ['far', 'file-alt'],
                component: <div />
            },
            {
                name: 'Deelnemer', // todo: translate this label
                icon: 'user',
                component: <div />
            }
        ];

        // note: report.text attributes may not be defined depending on the report type
        // these fields while be ignored in the rendering process
        return (
            <main className={ `${style.report} full_width_sidebar` } id="page_with_sidebar">

                <section className={style.page_with_sidebar_container} id="page_with_sidebar_container">

                    <Header
                        participant={report.participant}
                        product={report.product}
                        organisation={report.organisation}
                        consultant={report.consultant}
                    />

                    <Introduction
                        texts={report.texts}
                        saveReportText={saveReportText}
                    />

                </section>

                <Sidebar tabs={ tabs } />

            </main>
        );
    }
}
