import { h, Component } from 'preact';

/** @jsx h */

import style from './style/report.scss';
import Header from './components/Header/Header';
import Sidebar from './../../../../components/Sidebar';
import ReportSection from './components/ReportSection/ReportSection';
import ReportColumn from './components/ReportSection/components/ReportColumn/ReportColumn';
import TextBlock from './components/ReportSection/components/ReportColumn/components/TextBlock/TextBlock';

export default class Report extends Component {
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
        if (!report.isLoaded) {
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

                    <ReportSection title="Introduction">
                        <ReportColumn>
                            <TextBlock
                                field={report.texts.goal}
                            />
                            <TextBlock
                                field={report.texts.validity}
                            />
                        </ReportColumn>
                        <ReportColumn>
                            <TextBlock
                                field={report.texts.parts}
                            />
                            <TextBlock
                                field={report.texts.structure}
                            />
                        </ReportColumn>
                    </ReportSection>

                </section>

                <Sidebar tabs={ tabs } />

            </main>
        );
    }
}
