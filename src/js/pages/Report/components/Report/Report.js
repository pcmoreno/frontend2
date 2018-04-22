import { h, Component } from 'preact';

/** @jsx h */

import style from './style/report.scss';
import Header from './components/Header/Header';
import Sidebar from './../../../../components/Sidebar';
import Section from './components/Section/Section';
import Column from './components/Column/Column';

export default class Report extends Component {
    render() {

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

        return (
            <main id="page_with_sidebar" className={ `${style.report} full_width_sidebar` }>
                <section id="page_with_sidebar_container" className={style.page_with_sidebar_container}>

                    <Header
                        participant={report.participant}
                        product={report.product}
                        organisation={report.organisation}
                        consultant={report.consultant}
                    />

                    <Section title={'Introduction'}>
                        <Column>
                            {/* todo: add text blocks here */}
                        </Column>
                        <Column>
                            {/* todo: add text blocks here */}
                        </Column>
                    </Section>

                </section>
                <Sidebar tabs={ tabs } />
            </main>
        );
    }
}
