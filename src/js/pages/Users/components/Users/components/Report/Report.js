import { h, Component } from 'preact';

/** @jsx h */

import style from './style/report.scss';

export default class Report extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <span className={ style.report }>
                report
            </span>
        );
    }
}
