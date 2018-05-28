import { h, Component } from 'preact';

/** @jsx h */

import style from './style/header.scss';

export default class Header extends Component {

    render() {
        const { participant, product, organisation, consultant, i18n } = this.props;

        // todo: product.name should be translated but needs NEON-3788 first

        const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

        let date = participant.appointmentDate;

        months.forEach(month => {
            if (participant.appointmentDate.indexOf(month) >= 0) {
                date = date.replace(month, i18n[`report_${month}`]);
            }
        });

        return (
            <section className={ style.header }>
                <h1>{ participant.name }</h1>
                <h1>{ product.name }</h1>
                <div className={style.tableContainer}>
                    <table>
                        <tbody>
                            <tr>
                                <th>{ i18n.report_organisation }</th>
                                <td>{ organisation.name }</td>
                            </tr>
                            {
                                organisation.jobFunction && <tr>
                                    <th>{ i18n.report_jobfunction }</th>
                                    <td>{ organisation.jobFunction }</td>
                                </tr>
                            }
                        </tbody>
                    </table>

                    <table>
                        <tbody>
                            <tr>
                                <th>{ i18n.report_assessment_date }</th>
                                <td className={ style.date }>{ date }</td>
                            </tr>
                            <tr>
                                <th>{ i18n.report_consultant }</th>
                                <td>{ consultant.name }</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        );
    }
}
