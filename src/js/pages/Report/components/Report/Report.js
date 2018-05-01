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
        if (!window.$ || !window.jQuery) {
            Utils.loadExternalScript(AppConfig.sources.jquery).then(() => {

                // also check if froala should be loaded
                if (!window.froalaLoaded) {
                    Utils.loadExternalScript(AppConfig.sources.froala).then(() => {
                        window.froalaLoaded = true;
                    });
                }
            });

        } else if (!window.froalaLoaded) {

            // jquery was defined, but froala was not
            Utils.loadExternalScript(AppConfig.sources.froala).then(() => {
                window.froalaLoaded = true;
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

        const { report } = this.props;

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
                    />

                </section>

                <Sidebar tabs={ tabs } />

            </main>
        );
    }
}
