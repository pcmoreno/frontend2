import { h, Component } from 'preact';

/** @jsx h */

import IndicatorArrow from '../../../../../IndicatorArrow/index';
import style from './style/indicator.scss';

export default class Indicator extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <span className={ style.indicator } id="sidebar_indicator">
                <IndicatorArrow />
            </span>
        );
    }
}
