import { h, Component } from 'preact';

/** @jsx h */

import style from './style/header.scss';

export default class Header extends Component {

    render() {
        const { participant, product, organisation, consultant, i18n } = this.props;

        const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

        let date = participant.appointmentDate.toLowerCase();

        months.forEach(month => {
            if (participant.appointmentDate.toLowerCase().indexOf(month) >= 0) {
                date = date.replace(month, i18n[`report_${month}`]);
            }
        });

        // translate product name
        if (i18n[`report_${product.translationKey}`]) {
            product.name = i18n[`report_${product.translationKey}`];
        }

        let showSecondTable = true;

        if (!date && !consultant.name) {
            showSecondTable = false;
        }

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

                    {
                        showSecondTable && <table>
                            <tbody>
                                {
                                    date && <tr>
                                        <th>{i18n.report_assessment_date}</th>
                                        <td>{date}</td>
                                    </tr>
                                }
                                {
                                    consultant.name && <tr>
                                        <th>{ i18n.report_consultant }</th>
                                        <td>{ consultant.name }</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    }
                </div>
            </section>
        );
    }
}
