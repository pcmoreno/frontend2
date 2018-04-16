import { h, Component } from 'preact';

/** @jsx h */

import IndicatorArrow from './../../../../../../components/IndicatorArrow';
import style from './style/indicator.scss';

export default class Indicator extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <span className={ style.indicator } id="indicator">
                <IndicatorArrow />
            </span>
        );
    }
}
