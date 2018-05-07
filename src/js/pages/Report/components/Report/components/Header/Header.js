import { h, Component } from 'preact';

/** @jsx h */

import style from './style/header.scss';

export default class Header extends Component {

    render() {
        const { participant, product, organisation, consultant, i18n } = this.props;

        // todo: table headers (th) should be translated
        // todo: product.name should be translated

        const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

        let date = participant.appointmentDate;

        months.forEach(month => {
            if (participant.appointmentDate.indexOf(month) >= 0) {
                date = date.replace(month, i18n[month]);
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
                                <th>{i18n.organisation}</th>
                                <td>{ organisation.name }</td>
                            </tr>
                            {
                                organisation.jobFunction && <tr>
                                    <th>Job function</th> {/* todo: add translation */}
                                    <td>{organisation.jobFunction}</td>
                                </tr>
                            }
                        </tbody>
                    </table>

                    <table>
                        <tbody>
                            <tr>
                                <th>{i18n.assessment_date}</th>
                                <td>{ date }</td>
                            </tr>
                            <tr>
                                <th>{i18n.consultant}</th>
                                <td>{ consultant.name }</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        );
    }
}
