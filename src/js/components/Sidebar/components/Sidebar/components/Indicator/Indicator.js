import { h, Component } from 'preact';
import IndicatorArrow from '../../../../../IndicatorArrow/index';
import style from './style/indicator.scss';

/** @jsx h */

export default class Indicator extends Component {
    render() {
        return (
            <span className={ style.indicator } id="sidebar_indicator">
                <IndicatorArrow />
            </span>
        );
    }
}
