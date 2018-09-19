import { h, Component } from 'preact';
import style from './style/report.scss';

/** @jsx h */

export default class Report extends Component {
    render() {
        return (
            <span className={ style.report }>
                report
            </span>
        );
    }
}
