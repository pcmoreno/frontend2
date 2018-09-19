import { h, Component } from 'preact';
import IndicatorArrow from './../../../../../../components/IndicatorArrow';
import style from './style/indicator.scss';

/** @jsx h */

export default class Indicator extends Component {
    render() {
        return (
            <span className={ style.indicator } id="indicator">
                <IndicatorArrow />
            </span>
        );
    }
}
